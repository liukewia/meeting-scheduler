import { Spin, Card, message } from 'antd';
import moment from 'moment';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useModel } from 'umi';
import {
  Calendar as BigCalendar,
  Views,
  momentLocalizer,
} from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import CustomToolbar from './CustomToolbar';
import CalendarForm from './CalendarForm';
import { useReactive, useRequest } from 'ahooks';
import { ONE_DAY_MILLIS } from '@/constants';
import { isString } from 'lodash';
import { searchSchdule } from '@/services/schedule';
import {
  mapPercentageToPriorityId,
  mapPriorityIdToPercentage,
} from '@/utils/scheduleUtil';
import { updateSchdule } from '@/services/schedule';
import type { stringOrDate } from 'react-big-calendar';

// Is there a way to change your timezone in Chrome devtools?
// https://stackoverflow.com/a/60008052/14756060

// moment.tz.setDefault('Europe/London');
moment.locale('en-gb', {
  week: {
    dow: 1,
    doy: 1,
  },
});

const localizer = momentLocalizer(moment);
// @ts-ignore
const DragAndDropCalendar = withDragAndDrop(BigCalendar);

export interface CalendarEvent {
  id?: number;
  title: string;
  location: string;
  start: stringOrDate;
  end: stringOrDate;
  priority: number;
  note: string;
}

const Calendar: React.FC = (props) => {
  const { initialState } = useModel('@@initialState');
  const utcOffset = initialState?.currentUser?.utcOffset || 0;
  // solve flicker problem
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isFormVisible, setFormVisible] = useState(false);
  const visibleRange = useReactive({
    midTime: new Date().getTime() + utcOffset,
    startTime: 0,
    endTime: 0,
  });

  const isEditRef = useRef(false);
  const selectedEventRef = useRef<Partial<CalendarEvent>>({});

  const { data: eventData, run: runFetch } = useRequest(searchSchdule, {
    manual: true,
    onSuccess: () => {
      if (
        eventData &&
        eventData.schedules &&
        Object.keys(eventData.schedules).length > 0
      ) {
        setEvents(
          eventData.schedules.map((schedule: any) => ({
            id: schedule.id,
            title: schedule.title,
            location: schedule.location,
            start: new Date(schedule.startTime),
            end: new Date(schedule.endTime),
            priority: mapPriorityIdToPercentage(schedule.priorityId),
            note: schedule.note,
          })),
        );
      }
      // message.success('Successfully fetch schedules.');
    },
    onError: () => {
      fetchEventsInRange();
      message.error('Unable to fetch schedules.');
    },
  });

  const { loading: updateLoading, run: runUpdateSchedule } = useRequest(
    updateSchdule,
    {
      manual: true,
      onSuccess: () => {
        handleCancel();
        fetchEventsInRange();
        message.success('Update sccueeded.');
      },
      onError: () => {
        fetchEventsInRange();
        message.error('Unable to update schedule.');
      },
    },
  );

  const fetchEventsInRange = useCallback(() => {
    const { midTime, startTime, endTime } = visibleRange;
    runFetch(
      startTime && endTime
        ? {
            startTime,
            endTime,
          }
        : {
            midTime,
          },
    );
  }, [visibleRange.midTime, visibleRange.startTime, visibleRange.endTime]);

  useEffect(() => {
    fetchEventsInRange();
  }, [visibleRange.midTime, visibleRange.startTime, visibleRange.endTime]);

  const onRangeChange = (dates: any, view: string | undefined) => {
    let startTime = 0;
    let endTime = 0;
    if (Array.isArray(dates)) {
      if (dates.length === 7) {
        // is week view
        startTime = dates[0].getTime();
        endTime = dates[dates.length - 1].getTime() + ONE_DAY_MILLIS;
      } else if (dates.length === 1) {
        // is day view
        startTime = dates[0].getTime();
        endTime = startTime + ONE_DAY_MILLIS;
      }
    } else {
      // is month or agenda view
      startTime = dates.start?.getTime();
      endTime = dates.end?.getTime();
    }
    visibleRange.startTime = startTime;
    visibleRange.endTime = endTime;
  };

  const showCreateForm = () => {
    isEditRef.current = false;
    // Round up to the nearest minute
    let now = moment().startOf('minute').add(utcOffset, 'ms');
    selectedEventRef.current = {
      start: now.toDate(),
      end: now.add(1, 'h').toDate(),
      priority: 50,
    };
    setFormVisible(true);
  };

  const updateEventOnResizeOrDrop = ({
    event,
    start,
    end,
    isAllDay,
  }: {
    event: object;
    start: stringOrDate;
    end: stringOrDate;
    isAllDay: boolean;
  }) => {
    console.log('event: ', event);
    console.log('start: ', start);
    console.log('end: ', end);
    console.log('isAllDay: ', isAllDay);
    const _event = event as CalendarEvent;
    const updatedEvent = events.map((existingEvent) => {
      return existingEvent.id == _event.id
        ? { ...existingEvent, start, end }
        : existingEvent;
    });
    setEvents(updatedEvent);
    runUpdateSchedule({
      id: _event.id,
      title: _event.title,
      location: _event.location,
      startTime: (isString(start) ? new Date(start) : start).getTime(),
      endTime: (isString(end) ? new Date(end) : end).getTime(),
      priorityId: mapPercentageToPriorityId(_event.priority),
      note: _event.note,
    });
  };

  const onDoubleClickSlot = (event: any) => {
    if (event.action === 'select') {
      isEditRef.current = false;
      selectedEventRef.current = {
        start: event.start,
        end: event.end,
        priority: 50,
      };
      setFormVisible(true);
    }
  };

  const handleCancel = () => {
    setFormVisible(false);
    selectedEventRef.current = {
      priority: 50,
    };
  };

  const currentDate = new Date(visibleRange.midTime) || new Date() + utcOffset;

  return (
    <Card>
      <DragAndDropCalendar
        popup
        defaultDate={currentDate}
        getNow={() => currentDate}
        onRangeChange={onRangeChange}
        localizer={localizer}
        events={events}
        components={{
          toolbar: (props) => (
            <CustomToolbar {...props} showCreateForm={showCreateForm} />
          ),
        }}
        defaultView={Views.MONTH}
        resizable
        selectable
        onSelectSlot={onDoubleClickSlot}
        onDoubleClickEvent={(event) => {
          isEditRef.current = true;
          selectedEventRef.current = event;
          setFormVisible(true);
        }}
        onEventResize={updateEventOnResizeOrDrop}
        onEventDrop={updateEventOnResizeOrDrop}
        style={{ minHeight: 800 }}
      />
      <CalendarForm
        visible={isFormVisible}
        isEditRef={isEditRef}
        selectedEventRef={selectedEventRef}
        onCancel={handleCancel}
        fetchEventsInRange={fetchEventsInRange}
        updateLoading={updateLoading}
        runUpdateSchedule={runUpdateSchedule}
      />
    </Card>
  );
};

export default Calendar;
