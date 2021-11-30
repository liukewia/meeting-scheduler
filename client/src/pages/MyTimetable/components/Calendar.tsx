import { Spin, Card, message, Tag } from 'antd';
import moment from 'moment';
import type { Moment } from 'moment';
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
import { ONE_DAY_MILLIS, ONE_MINUTE_MILLIS } from '@/constants';
import { isString } from 'lodash';
import { searchSchdule } from '@/services/schedule';
import {
  mapPercentToPriorityId,
  mapPriorityIdToPercent,
  mapPriorityPercentToColor,
  mapPriorityPercentToTxt,
} from '@/utils/scheduleUtil';
import { updateSchdule } from '@/services/schedule';
import type { stringOrDate } from 'react-big-calendar';
import { utcNow } from '@/utils/timeUtil';

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

export interface CalendarFormEvent {
  id?: number;
  title: string;
  location: string;
  start: Moment;
  end: Moment;
  priority: number;
  note: string;
}

function EventAgenda({ event }) {
  return (
    <span>
      <a style={{ color: 'magenta' }}>{event.title}</a>
      <Tag
        color={mapPriorityPercentToColor(event.priority)}
        style={{ marginLeft: 10 }}
      >
        {mapPriorityPercentToTxt(event.priority)} Priority
      </Tag>
    </span>
  );
}

const Calendar: React.FC = (props) => {
  const { initialState } = useModel('@@initialState');
  const utcOffset = initialState?.currentUser?.utcOffset || 0;
  // solve flicker problem
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isFormVisible, setFormVisible] = useState(false);
  const visibleRange = useReactive({
    midTime: utcNow() + utcOffset,
    startTime: 0,
    endTime: 0,
  });

  const isEditRef = useRef(false);
  const selectedEventRef = useRef<Partial<CalendarFormEvent>>({});

  const {
    data: eventData,
    loading: fetchLoading,
    run: runFetch,
  } = useRequest(searchSchdule, {
    manual: true,
    debounceWait: 100,
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
            priority: mapPriorityIdToPercent(schedule.priorityId),
            note: schedule.note,
          })),
        );
      }
      // message.success('Successfully fetch schedules.');
    },
    onError: () => {
      message.error('Fetch schedules failed.');
    },
  });

  const { loading: updateLoading, run: runUpdateSchedule } = useRequest(
    updateSchdule,
    {
      manual: true,
      debounceWait: 100,
      onSuccess: () => {
        handleCancel();
        fetchEventsInRange();
        message.success('Update sccueeded.');
      },
      onError: () => {
        fetchEventsInRange();
        message.error('Update schedule failed.');
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

  console.log('utcNow(): ', utcNow());
  console.log(`utcNow().startOf('minute'): `, utcNow().startOf('minute'));
  console.log(
    `utcNow().startOf('minute').add(utcOffset, 'ms'): `,
    utcNow().startOf('minute').add(utcOffset, 'ms'),
  );

  const showCreateForm = () => {
    isEditRef.current = false;
    // Round up to the nearest minute
    selectedEventRef.current = {
      // do not use utcNow() here because antd will offset time again
      start: moment.utc().startOf('minute').add(utcOffset, 'ms'),
      end: moment.utc().startOf('minute').add(utcOffset, 'ms').add(1, 'h'), // dont use shallow copy
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
    const _event = event as CalendarEvent;

    const formerStartTime = (
      isString(_event.start) ? new Date(_event.start) : _event.start
    ).getTime();
    const formerEndTime = (
      isString(_event.end) ? new Date(_event.end) : _event.end
    ).getTime();
    let latterStartDate = isString(start) ? new Date(start) : start;
    let latterStartTime = latterStartDate.getTime();
    let latterEndDate = isString(end) ? new Date(end) : end;
    let latterEndTime = latterEndDate.getTime();

    if (
      formerStartTime === latterStartTime &&
      formerEndTime === latterEndTime &&
      !isAllDay
    ) {
      return;
    }

    if (isAllDay) {
      latterStartDate = moment(latterStartDate).startOf('day').toDate();
      latterStartTime = latterStartDate.getTime();
      latterEndDate = moment(latterEndDate).endOf('day').toDate();
      latterEndTime = latterEndDate.getTime();
    }

    if (latterStartTime >= latterEndTime) {
      latterEndTime = latterStartTime + ONE_MINUTE_MILLIS;
      latterEndDate = new Date(latterEndTime);
    }

    // console.log('formerStartDate: ', new Date(formerStartTime));
    // console.log('formerEndTime: ', new Date(formerEndTime));
    // console.log('latterStartDate: ', latterStartDate);
    // console.log('latterEndDate: ', latterEndDate);
    const updatedEvent = events.map((existingEvent) => {
      return existingEvent.id == _event.id
        ? { ...existingEvent, start: latterStartDate, end: latterEndDate }
        : existingEvent;
    });
    setEvents(updatedEvent);
    runUpdateSchedule({
      id: _event.id,
      title: _event.title,
      location: _event.location,
      startTime: latterStartTime,
      endTime: latterEndTime,
      priorityId: mapPercentToPriorityId(_event.priority),
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

  const currentDate = new Date(visibleRange.midTime) || utcNow() + utcOffset;

  return (
    <Card>
      <Spin tip="Loading..." size="large" spinning={fetchLoading} delay={100}>
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
            agenda: {
              event: EventAgenda,
            },
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
      </Spin>
    </Card>
  );
};

export default Calendar;
