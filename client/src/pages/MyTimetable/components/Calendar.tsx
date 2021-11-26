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
import { useCallback, useMemo, useEffect, useState } from 'react';
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
import { useRequest } from 'ahooks';
import { ONE_DAY_MILLIS, ONE_HOUR_MILLIS } from '@/constants';
import { searchSchdule } from '@/services/schedule';
import { mapPriorityIdToPercentage } from '@/utils/scheduleUtil';
import 'moment-timezone';

moment.tz.setDefault('Europe/London');
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
  const [midDate, _] = useState(new Date()); // used to do initial req
  const [events, setEvents] = useState([]);
  const [visibleRange, setVisibleRange] = useState({
    startTime: 0,
    endTime: 0,
  });
  const [isFormVisible, setFormVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});
  // console.log('midDate: ', midDate);
  console.log('events: ', events);

  const { initialState, setInitialState } = useModel('@@initialState');

  const {
    data,
    loading: fetchLoading,
    run: runFetch,
  } = useRequest(searchSchdule, {
    manual: true,
    onSuccess: () => {
      if (data && data.schedules && Object.keys(data.schedules).length > 0) {
        setEvents(
          data.schedules.map((schedule: any) => ({
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
      // message.info('Successfully fetch schedules.');
    },
    onError: () => {
      message.error('Unable to fetch schedules.');
    },
  });

  useEffect(() => {
    runFetch({
      midTime: midDate.getTime(),
    });
  }, []);

  const onRangeChange = (dates: any, view: string | undefined) => {
    // console.log('dates: ', dates);
    // console.log('view: ', view);
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
    runFetch({
      startTime,
      endTime,
    });
    setVisibleRange({
      startTime,
      endTime,
    });
  };

  const manualFetch = useCallback(() => {
    runFetch(visibleRange);
  }, [visibleRange]);

  const showCreateForm = () => {
    setIsEdit(false);
    const utcOffset = initialState?.currentUser?.utcOffset || 0;
    console.log('utcOffset: ', utcOffset);
    let now = moment();
    now =
      utcOffset >= 0 ? now.add(utcOffset, 'ms') : now.subtract(utcOffset, 'ms');

    setSelectedEvent({
      start: now.toDate(),
      end: now.add(1, 'h').toDate(),
      priority: 50,
    });
    setFormVisible(true);
  };

  const moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
    let allDay = event.allDay;

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true;
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false;
    }

    const updatedEvent = events.map((existingEvent) => {
      return existingEvent.id == event.id
        ? { ...existingEvent, start, end, allDay }
        : existingEvent;
    });

    setEvents(updatedEvent);

    console.log(`[${event.title}] was dropped onto [${start}]`);
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

  const onDoubleClickSlot = (_event) => {
    console.log('_event: ', _event);
    if (_event.action === 'select') {
      setIsEdit(false);
      setSelectedEvent({
        start: _event.start,
        end: _event.end,
        priority: 50,
      });
      setFormVisible(true);
    }
  };

  const handleCancel = () => {
    setFormVisible(false);
    setSelectedEvent({
      priority: 50,
    });
  };

  return (
    <Card>
      <Spin size="large" spinning={fetchLoading}>
        <DragAndDropCalendar
          popup
          defaultDate={midDate}
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
            console.log('event: ', event);
            setIsEdit(true);
            setSelectedEvent(event);
            setFormVisible(true);
          }}
          onEventResize={resizeEvent}
          onEventDrop={moveEvent}
          style={{ minHeight: 800 }}
        />
        <CalendarForm
          visible={isFormVisible}
          isEdit={isEdit}
          selectedEvent={selectedEvent}
          onCancel={handleCancel}
          manualFetch={manualFetch}
        />
      </Spin>
    </Card>
  );
};

export default Calendar;
