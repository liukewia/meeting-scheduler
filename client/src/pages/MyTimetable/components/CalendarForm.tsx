import React, { useContext, useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Button,
  Radio,
  Slider,
} from 'antd';
import {
  mapPercentageToPriorityId,
  parseEventInForm,
} from '@/utils/scheduleUtil';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { addSchdule, deleteSchdule, updateSchdule } from '@/services/schedule';

const { RangePicker } = DatePicker;

const marks = {
  0: 'None',
  25: 'Low',
  50: 'Normal',
  75: 'High',
  100: 'Inf',
};

const CalendarForm = ({
  visible,
  isEdit,
  selectedEvent,
  onCancel,
  manualFetch,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.resetFields();
      form.setFieldsValue(parseEventInForm(selectedEvent));
    }
  }, [selectedEvent, visible, form]);

  const { loading: addLoading, run: runAddSchedule } = useRequest(addSchdule, {
    manual: true,
    onSuccess: () => {
      onCancel();
      manualFetch();
    },
    onError: () => {
      message.error('Unable to add schedule.');
    },
  });

  const { loading: updateLoading, run: runUpdateSchedule } = useRequest(
    updateSchdule,
    {
      manual: true,
      onSuccess: () => {
        onCancel();
        manualFetch();
      },
      onError: () => {
        message.error('Unable to update schedule.');
      },
    },
  );

  const { loading: deleteLoading, run: runDeleteSchedule } = useRequest(
    deleteSchdule,
    {
      manual: true,
      onSuccess: () => {
        onCancel();
        manualFetch();
      },
      onError: () => {
        message.error('Unable to delete schedule.');
      },
    },
  );

  const onSubmitForm = (values: any) => {
    console.log('values: ', values);
    // add or update
    const schedule = {
      id: selectedEvent.id,
      title: values.title,
      location: values.location,
      startTime: values.time[0].valueOf(),
      endTime: values.time[1].valueOf(),
      priority: mapPercentageToPriorityId(values.priority),
      note: values.note,
    };

    console.log('schedule: ', schedule);
    if (schedule.id === undefined) {
      runAddSchedule(schedule);
    } else {
      runUpdateSchedule(schedule);
    }
  };

  const onDeleteEvent = ({ id }) => {
    runDeleteSchedule({
      id,
    });
  };

  return (
    <Modal
      centered
      forceRender
      visible={visible}
      title={isEdit ? 'Edit Event' : 'New Event'}
      onCancel={onCancel}
      footer={[
        isEdit ? (
          <Button
            key="delete"
            danger
            onClick={() => onDeleteEvent(selectedEvent)}
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
        <Form.Item
          name="location"
          label="location"
          // rules={[{ required: true }]}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item name="time" label="time" rules={[{ required: true }]}>
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="DD/MM/YYYY HH:mm"
            ranges={{
              Now: [moment(), moment()],
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
        <Form.Item name="note" label="note">
          <Input.TextArea allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CalendarForm;
