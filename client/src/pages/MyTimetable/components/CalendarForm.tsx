import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, message, Button, Slider } from 'antd';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { useModel } from 'umi';
import { mapPercentToPriorityId, parseEventInForm } from '@/utils/scheduleUtil';
import { addSchdule, deleteSchdule } from '@/services/schedule';
import { CalendarFormEvent } from './Calendar';

const { RangePicker } = DatePicker;

const marks = {
  0: 'None',
  25: 'Low',
  50: 'Normal',
  75: 'High',
  100: 'Inf',
};

interface CalendarFormProp {
  visible: boolean;
  isEditRef: React.MutableRefObject<Boolean>;
  selectedEventRef: React.MutableRefObject<Partial<CalendarFormEvent>>;
  onCancel: () => void;
  fetchEventsInRange: () => void;
  updateLoading: boolean;
  runUpdateSchedule: (
    body: any,
    options?: { [key: string]: any } | undefined,
  ) => void;
}

const CalendarForm: React.FC<CalendarFormProp> = ({
  visible,
  isEditRef,
  selectedEventRef,
  onCancel,
  fetchEventsInRange,
  updateLoading,
  runUpdateSchedule,
}) => {
  const [form] = Form.useForm();
  const { getZonedUtcNow } = useModel('time');

  useEffect(() => {
    if (visible) {
      // setFieldsValue won't set fields that is not included in the object arg, so need to clean all fields manually in the first place
      form.resetFields();
      form.setFieldsValue(parseEventInForm(selectedEventRef.current));
    }
  }, [selectedEventRef.current, visible, form]);

  const { loading: addLoading, run: runAddSchedule } = useRequest(addSchdule, {
    manual: true,
    debounceWait: 100,
    onSuccess: () => {
      onCancel();
      fetchEventsInRange();
      message.success('Successfully add schedule.');
    },
    onError: () => {
      fetchEventsInRange();
      message.error('Add schedule failed.');
    },
  });

  const { loading: deleteLoading, run: runDeleteSchedule } = useRequest(
    deleteSchdule,
    {
      manual: true,
      debounceWait: 100,
      onSuccess: () => {
        onCancel();
        fetchEventsInRange();
        message.success('Successfully delete schedule.');
      },
      onError: () => {
        fetchEventsInRange();
        message.error('Delete schedule failed.');
      },
    },
  );

  const onSubmitForm = (values: any) => {
    // add or update
    const schedule = {
      id: selectedEventRef.current.id,
      title: values.title,
      location: values.location,
      startTime: values.time[0].valueOf(),
      endTime: values.time[1].valueOf(),
      priorityId: mapPercentToPriorityId(values.priority),
      note: values.note,
    };
    schedule.id === undefined
      ? runAddSchedule(schedule)
      : runUpdateSchedule(schedule);
  };

  const onDeleteEvent = (event: Partial<CalendarFormEvent>) => {
    if (event.id === undefined) {
      console.error('The event id is undefined');
      return;
    }
    runDeleteSchedule({ id: event.id });
  };

  return (
    <Modal
      centered
      forceRender
      visible={visible}
      title={isEditRef.current ? 'Edit Event' : 'New Event'}
      onCancel={onCancel}
      footer={[
        isEditRef.current ? (
          <Button
            key="delete"
            danger
            onClick={() => onDeleteEvent(selectedEventRef.current)}
            loading={deleteLoading}
          >
            Delete
          </Button>
        ) : null,
        <Button
          key="submit"
          type="primary"
          onClick={form.submit}
          loading={addLoading || updateLoading}
        >
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={onSubmitForm}>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input allowClear />
        </Form.Item>
        <Form.Item name="location" label="Location">
          <Input allowClear />
        </Form.Item>
        <Form.Item name="time" label="Time" rules={[{ required: true }]}>
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="DD/MM/YYYY HH:mm"
            ranges={{
              '1h': [
                getZonedUtcNow().startOf('minute'),
                getZonedUtcNow().startOf('minute').add(1, 'h'),
              ],
              '2h': [
                getZonedUtcNow().startOf('minute'),
                getZonedUtcNow().startOf('minute').add(2, 'h'),
              ],
              '3h': [
                getZonedUtcNow().startOf('minute'),
                getZonedUtcNow().startOf('minute').add(3, 'h'),
              ],
            }}
            placeholder={['Start Time', 'End Time']}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item
          name="priority"
          label="Priority"
          rules={[{ required: true, message: 'Please pick an item!' }]}
        >
          <Slider marks={marks} step={null} tooltipVisible={false} />
        </Form.Item>
        <Form.Item name="note" label="Note">
          <Input.TextArea allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CalendarForm;
