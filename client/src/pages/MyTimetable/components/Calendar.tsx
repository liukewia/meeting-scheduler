import { Spin, Card, message, Tag } from 'antd';
import moment from 'moment';
import type { Moment } from 'moment';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useModel } from 'umi';
import {
  Calendar as BaseCalendar,
  Views,
  momentLocalizer,
  NavigateAction,
} from 'react-big-calendar';
import type { View } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'moment-timezone';
import CustomToolbar from './CustomToolbar';
import CalendarForm from './CalendarForm';
import { useReactive, useRequest } from 'ahooks';
import { ONE_MINUTE_MILLIS } from '@/constants';
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

// Is there a way to change your timezone in Chrome devtools?
// https://stackoverflow.com/a/60008052/14756060

// moment.tz.setDefault('Europe/London');
moment.locale('en-gb', {
  week: {
    dow: 1,
    doy: 1,
  },
});
moment.tz.setDefault('UTC');
const localizer = momentLocalizer(moment);
// @ts-ignore
const DragAndDropCalendar = withDragAndDrop(BaseCalendar);

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
        style={{ float: 'right' }}
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
  const { getUtcNow, getZonedUtcNow } = useModel('time');
  const visibleRange = useReactive({
    midTime: getZonedUtcNow().valueOf(),
    startTime: 0,
    endTime: 0,
  });
  const isEditRef = useRef<Boolean>(false);
  const viewRef = useRef<View>(Views.DAY);
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
            start: moment.utc(schedule.startTime).toDate(),
            end: moment.utc(schedule.endTime).toDate(),
            priority: mapPriorityIdToPercent(schedule.priorityId),
            note: schedule.note,
          })),
        );
      }
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
    if (!visibleRange.startTime && !visibleRange.endTime) {
      if (viewRef.current === Views.MONTH) {
        visibleRange.startTime = moment
          .utc(visibleRange.midTime)
          .startOf('month')
          .startOf('week')
          .valueOf();
        visibleRange.endTime = moment
          .utc(visibleRange.midTime)
          .endOf('month')
          .endOf('week')
          .valueOf();
      } else if (viewRef.current === Views.WEEK) {
        visibleRange.startTime = moment
          .utc(visibleRange.midTime)
          .startOf('week')
          .valueOf();
        visibleRange.endTime = moment
          .utc(visibleRange.midTime)
          .endOf('week')
          .valueOf();
      } else if (viewRef.current === Views.DAY) {
        visibleRange.startTime = moment
          .utc(visibleRange.midTime)
          .startOf('day')
          .valueOf();
        visibleRange.endTime = moment
          .utc(visibleRange.midTime)
          .endOf('day')
          .valueOf();
      } else if (viewRef.current === Views.AGENDA) {
        const startOfAgenda = moment
          .utc(visibleRange.midTime)
          .startOf('day')
          .valueOf();
        visibleRange.startTime = startOfAgenda;
        visibleRange.endTime = moment
          .utc(startOfAgenda)
          .add(30, 'day')
          .endOf('day')
          .valueOf();
      } else {
        console.error('Unknown calendar view');
        return;
      }
    }
    runFetch({
      startTime: visibleRange.startTime,
      endTime: visibleRange.endTime,
    });
  }, [visibleRange.midTime, visibleRange.startTime, visibleRange.endTime]);

  useEffect(() => {
    fetchEventsInRange();
  }, [visibleRange.midTime, visibleRange.startTime, visibleRange.endTime]);

  // normalize start time and end time
  const onRangeChange = (dates: any, _: View | undefined) => {
    let startTime: Moment;
    let endTime: Moment;
    if (viewRef.current === Views.MONTH) {
      startTime = moment(dates.start);
      endTime = moment(dates.end);
    } else if (viewRef.current === Views.WEEK) {
      startTime = moment(dates[0]);
      endTime = moment(dates[dates.length - 1]).endOf('day');
    } else if (viewRef.current === Views.DAY) {
      if (!Array.isArray(dates)) {
        // from month to day
        return;
      }
      // from week to day
      if (dates.length === 7) {
        return;
      }
      startTime = moment(dates[0]);
      endTime = moment(startTime).endOf('day');
    } else if (viewRef.current === Views.AGENDA) {
      startTime = moment(dates.start).startOf('day');
      endTime = moment(dates.end).endOf('day');
    } else {
      console.error('Unknown calendar view');
      return;
    }
    // update visible range
    visibleRange.startTime = startTime
      .add(moment().utcOffset(), 'minute')
      .valueOf();
    visibleRange.endTime = endTime
      .add(moment().utcOffset(), 'minute')
      .valueOf();
  };

  const showCreateForm = () => {
    isEditRef.current = false;
    // Round up to the nearest minute
    selectedEventRef.current = {
      start: getZonedUtcNow().startOf('minute'),
      end: getZonedUtcNow().startOf('minute').add(1, 'h'), // dont use shallow copy
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

  const currentDate = getZonedUtcNow()
    .subtract(moment().utcOffset(), 'minute')
    .toDate();

  return (
    <Card>
      <Spin tip="Loading..." size="large" spinning={fetchLoading}>
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
          defaultView={viewRef.current}
          onView={(view: View) => (viewRef.current = view)}
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
          onNavigate={(newDate: Date, view: View, action: NavigateAction) => {
            if (action === 'DATE') {
              if (view === Views.MONTH || view === Views.WEEK) {
                visibleRange.startTime = moment(newDate)
                  .startOf('day')
                  .valueOf();
                visibleRange.endTime = moment(newDate).endOf('day').valueOf();
              }
            }
          }}
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
