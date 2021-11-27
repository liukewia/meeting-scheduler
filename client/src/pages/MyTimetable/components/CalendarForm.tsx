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
import moment, { Moment } from 'moment';
import { useLatest, useRequest } from 'ahooks';
import { addSchdule, deleteSchdule, updateSchdule } from '@/services/schedule';
import { useModel } from 'umi';
import type { RangeValue } from 'rc-picker/lib/interface.d';

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
  isEditRef,
  selectedEventRef,
  onCancel,
  fetchEventsInRange,
  updateLoading,
  runUpdateSchedule,
}) => {
  const [form] = Form.useForm();
  const { initialState } = useModel('@@initialState');
  const utcOffset = initialState?.currentUser?.utcOffset || 0;

  useEffect(() => {
    if (visible) {
      // setFieldsValue won't set fields that is not included in the object arg, so need to clean all fields manually in the first place
      form.resetFields();
      form.setFieldsValue(parseEventInForm(selectedEventRef.current));
    }
  }, [selectedEventRef.current, visible, form]);

  const { loading: addLoading, run: runAddSchedule } = useRequest(addSchdule, {
    manual: true,
    onSuccess: () => {
      onCancel();
      fetchEventsInRange();
    },
    onError: () => {
      message.error('Unable to add schedule.');
    },
  });

  const { loading: deleteLoading, run: runDeleteSchedule } = useRequest(
    deleteSchdule,
    {
      manual: true,
      onSuccess: () => {
        onCancel();
        fetchEventsInRange();
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
      id: selectedEventRef.current.id,
      title: values.title,
      location: values.location,
      startTime: values.time[0].valueOf(),
      endTime: values.time[1].valueOf(),
      priorityId: mapPercentageToPriorityId(values.priority),
      note: values.note,
    };

    console.log('schedule: ', schedule);
    schedule.id === undefined
      ? runAddSchedule(schedule)
      : runUpdateSchedule(schedule);
  };

  const onDeleteEvent = ({ id }) => {
    runDeleteSchedule({ id });
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
        <Form.Item
          name="location"
          label="Location"
          // rules={[{ required: true }]}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item name="time" label="Time" rules={[{ required: true }]}>
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="DD/MM/YYYY HH:mm"
            ranges={{
              '1h': [
                moment().startOf('minute').add(utcOffset, 'ms'),
                moment().startOf('minute').add(utcOffset, 'ms').add(1, 'h'),
              ],
              '2h': [
                moment().startOf('minute').add(utcOffset, 'ms'),
                moment().startOf('minute').add(utcOffset, 'ms').add(2, 'h'),
              ],
              '3h': [
                moment().startOf('minute').add(utcOffset, 'ms'),
                moment().startOf('minute').add(utcOffset, 'ms').add(3, 'h'),
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
