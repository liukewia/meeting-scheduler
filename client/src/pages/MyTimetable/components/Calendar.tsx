import {
  Modal,
  Form,
  Input,
  DatePicker,
  Button,
  Space,
  Spin,
  Card,
} from 'antd';
import moment from 'moment';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { disabledDate } from '@/utils/timeUtil';
import { useModel } from 'umi';
import events from './events';
import {
  Calendar as BigCalendar,
  Views,
  momentLocalizer,
} from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import CustomToolbar from './CustomToolbar';
const localizer = momentLocalizer(moment);

const DragAndDropCalendar = withDragAndDrop(BigCalendar);

const { RangePicker } = DatePicker;

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: events,
      // displayDragItemInCell: true,
    };

    this.moveEvent = this.moveEvent.bind(this);
    this.newEvent = this.newEvent.bind(this);
  }

  handleDragStart = (event) => {
    this.setState({ draggedEvent: event });
  };

  moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
    const { events } = this.state;

    let allDay = event.allDay;

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true;
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false;
    }

    const nextEvents = events.map((existingEvent) => {
      return existingEvent.id == event.id
        ? { ...existingEvent, start, end, allDay }
        : existingEvent;
    });

    this.setState({
      events: nextEvents,
    });

    // alert(`${event.title} was dropped onto ${updatedEvent.start}`)
  };

  resizeEvent = ({ event, start, end }) => {
    const { events } = this.state;

    const nextEvents = events.map((existingEvent) => {
      return existingEvent.id == event.id
        ? { ...existingEvent, start, end }
        : existingEvent;
    });

    this.setState({
      events: nextEvents,
    });

    //alert(`${event.title} was resized to ${start}-${end}`)
  };

  newEvent(_event) {
    // let idList = this.state.events.map(a => a.id)
    // let newId = Math.max(...idList) + 1
    // let hour = {
    //   id: newId,
    //   title: 'New Event',
    //   allDay: event.slots.length == 1,
    //   start: event.start,
    //   end: event.end,
    // }
    // this.setState({
    //   events: this.state.events.concat([hour]),
    // })
  }

  render() {
    return (
      <Card>
        <Spin spinning={false}>
          <DragAndDropCalendar
            popup
            localizer={localizer}
            events={this.state.events}
            components={{
              toolbar: (props) => (
                <CustomToolbar
                  {...props}
                  // @ts-ignore
                  showCreateModalProp={showCreateModal}
                />
              ),
            }}
            defaultView={Views.WEEK}
            resizable
            onEventResize={this.resizeEvent}
            onEventDrop={this.moveEvent}
            selectable
            // A callback fired when a date selection is made. Only fires when selectable is true. 选中🈳️时间
            onSelectSlot={this.newEvent}
            // 选中一个事件
            onSelectEvent={(event) => alert(event.title)}
            defaultDate={new Date(2015, 3, 12)}
            handleDragStart={this.handleDragStart}
            style={{ height: '80vh' }}
          />
        </Spin>
      </Card>
    );
  }
}

export default Calendar;

// export default (props) => {
//   const { appTheme } = useModel('theme', (model) => ({
//     appTheme: model.appTheme,
//   }));

//   return <div>Calendar</div>;
// };
