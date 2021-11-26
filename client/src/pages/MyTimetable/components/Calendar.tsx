import {
  Modal,
  Form,
  Input,
  DatePicker,
  Button,
  Space,
  Spin,
  Card,
  message,
} from 'antd';
import moment from 'moment';
import { useCallback, useMemo, useEffect, useState, useRef } from 'react';
import { disabledDate } from '@/utils/timeUtil';
import { useModel } from 'umi';
import demo_events from './events';
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
import {
  useDeepCompareEffect,
  useMemoizedFn,
  useMount,
  useReactive,
  useRequest,
  useWhyDidYouUpdate,
} from 'ahooks';
import { ONE_DAY_MILLIS, ONE_HOUR_MILLIS } from '@/constants';
import { searchSchdule } from '@/services/schedule';
import { mapPriorityIdToPercentage } from '@/utils/scheduleUtil';
// import 'moment-timezone';
import { addSchdule, deleteSchdule, updateSchdule } from '@/services/schedule';

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

const Calendar: React.FC = (props) => {
  const { initialState } = useModel('@@initialState');
  const utcOffset = initialState?.currentUser?.utcOffset || 0;
  // console.log('utcOffset: ', utcOffset);
  const visibleRange = useReactive({
    midTime: new Date().getTime() + utcOffset,
    startTime: 0,
    endTime: 0,
  });
  // const [isFormVisible, setFormVisible] = useState(false);
  const isFormVisibleRef = useRef(false);
  const isEditRef = useRef(false);
  // const [isEditRef, setIsEdit] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});
  // console.log('visibleRange.midTime: ', visibleRange.midTime);
  // console.log('events: ', events);
  useWhyDidYouUpdate('calendar', {
    ...props,
    visibleRange,
    isFormVisibleRef,
    isEditRef,
    selectedEvent,
  });

  const {
    data: eventData,
    loading: fetchLoading,
    run: runFetch,
  } = useRequest(searchSchdule, {
    manual: true,
    onSuccess: () => {
      // console.log('eventData.schedules: ', eventData.schedules);
      // if (eventData && eventData.schedules && Object.keys(eventData.schedules).length > 0) {
      //   setEvents(
      //     eventData.schedules.map((schedule: any) => ({
      //       id: schedule.id,
      //       title: schedule.title,
      //       location: schedule.location,
      //       start: new Date(schedule.startTime),
      //       end: new Date(schedule.endTime),
      //       priority: mapPriorityIdToPercentage(schedule.priorityId),
      //       note: schedule.note,
      //     })),
      //   );
      // }
      // message.info('Successfully fetch schedules.');
    },
    onError: () => {
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
      },
      onError: () => {
        message.error('Unable to update schedule.');
      },
    },
  );

  // useMount(() => {
  //   console.log('useMounted');
  //   runFetch({
  //     midTime: visibleRange.midTime.getTime(),
  //   });
  // });

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
    // console.log('run effect');

    // const { midTime, startTime, endTime } = visibleRange;
    // console.log('visibleRange: ', visibleRange);
    // console.log('midTime: ', midTime);
    fetchEventsInRange();
  }, [visibleRange.midTime, visibleRange.startTime, visibleRange.endTime]);

  const onRangeChange = (dates: any, view: string | undefined) => {
    console.log('on range change');
    console.log('dates: ', dates);
    console.log('view: ', view);
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
    // runFetch({
    //   startTime,
    //   endTime,
    // });
    visibleRange.startTime = startTime;
    visibleRange.endTime = endTime;
  };
  // console.log('rerendered@@@');

  // console.log('visibleRange: ', {
  //   midTime: new Date(visibleRange.midTime),
  //   startTime: new Date(visibleRange.startTime),
  //   endTime: new Date(visibleRange.endTime),
  // });

  const showCreateForm = () => {
    // setIsEdit(false);
    isEditRef.current = false;
    // console.log('utcOffset: ', utcOffset);
    // Round up to the nearest minute
    let now = moment().startOf('minute').add(utcOffset, 'ms');
    console.log('now: ', now);
    setSelectedEvent({
      start: now.toDate(),
      end: now.add(1, 'h').toDate(),
      priority: 50,
    });
    isFormVisibleRef.current = true;
  };

  const onEventDrop = ({ event, start, end }) => {
    console.log('event: ', event);
    console.log('start: ', start.getTime());
    console.log('end: ', end);
    // console.log('droppedOnAllDaySlot: ', droppedOnAllDaySlot);
    // let allDay = event.allDay;

    // if (!event.allDay && droppedOnAllDaySlot) {
    //   allDay = true;
    // } else if (event.allDay && !droppedOnAllDaySlot) {
    //   allDay = false;
    // }

    // const updatedEvent = events.map((existingEvent) => {
    //   return existingEvent.id == event.id
    //     ? { ...existingEvent, start, end, allDay }
    //     : existingEvent;
    // });

    // setEvents(updatedEvent);

    // console.log(`[${event.title}] was dropped onto [${start}]`);
  };

  const resizeEvent = ({ event, start, end }) => {
    const nextEvents = events.map((existingEvent) => {
      return existingEvent.id == event.id
        ? { ...existingEvent, start, end }
        : existingEvent;
    });

    setEvents(nextEvents);

    console.log(`${event.title} was resized to {${start}}-{${end}}`);
  };

  const onDoubleClickSlot = (event) => {
    // console.log('event: ', event);
    if (event.action === 'select') {
      // setIsEdit(false);
      isEditRef.current = false;
      setSelectedEvent({
        start: event.start,
        end: event.end,
        priority: 50,
      });
      isFormVisibleRef.current = true;
    }
  };

  const handleCancel = () => {
    isFormVisibleRef.current = false;
    setSelectedEvent({
      priority: 50,
    });
  };

  const events = eventData?.schedules
    ? eventData.schedules.map((schedule: any) => ({
        id: schedule.id,
        title: schedule.title,
        location: schedule.location,
        start: new Date(schedule.startTime),
        end: new Date(schedule.endTime),
        priority: mapPriorityIdToPercentage(schedule.priorityId),
        note: schedule.note,
      }))
    : [];

  const currentDate = new Date(visibleRange.midTime) || new Date() + utcOffset;
  console.log('isFormVisibleRef.current: ', isFormVisibleRef.current);
  return (
    <Card>
      <Spin size="large" spinning={fetchLoading}>
        <DragAndDropCalendar
          popup
          defaultDate={currentDate}
          getNow={() => currentDate}
          onRangeChange={onRangeChange}
          localizer={localizer}
          events={events}
          components={{
            toolbar: (props) => (
              <CustomToolbar
                {...props}
                // @ts-ignore
                showCreateForm={showCreateForm}
              />
            ),
          }}
          // timeslots={1}
          defaultView={Views.MONTH}
          resizable
          selectable
          onSelectSlot={onDoubleClickSlot}
          onDoubleClickEvent={(event) => {
            // console.log('event: ', event);
            // setIsEdit(true);
            isEditRef.current = true;
            setSelectedEvent(event);
            isFormVisibleRef.current = true;
          }}
          onEventResize={resizeEvent}
          onEventDrop={onEventDrop}
          style={{ minHeight: 800 }}
        />
        <CalendarForm
          visible={isFormVisibleRef.current}
          isEditRef={isEditRef}
          selectedEvent={selectedEvent}
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
