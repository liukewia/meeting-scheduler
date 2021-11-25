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
import { InfoCircleOutlined } from '@ant-design/icons';
import { formRules } from './formConfig';
import { parseEventInForm } from '@/utils/scheduleUtil';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { addSchdule, updateSchdule } from '@/services/schedule';

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
  onCommitChanges,
  onCancel,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      console.log('setFieldsValue');
      console.log('selectedEvent: ', selectedEvent);
      form.resetFields();
      form.setFieldsValue(parseEventInForm(selectedEvent));
    }
  }, [selectedEvent, visible, form]);

  const { loading: addLoading, run: runAddSchedule } = useRequest(addSchdule, {
    manual: true,
    onError: () => {
      message.error('Unable to add schedule.');
    },
  });
  const { loading: uodateLoading, run: runUpdateSchedule } = useRequest(
    updateSchdule,
    {
      manual: true,
      onError: () => {
        message.error('Unable to update schedule.');
      },
    },
  );

  const onSubmitForm = (schedule: any) => {
    // add or update

    console.log('schedule: ', schedule);

    // console.warn('我进入onSubmitForm，它是编辑模式?', isEdit);
    // console.log('Data original (OnClick): ', originalEvent);
    // form
    //   .validateFields()
    //   .then(async (values) => {
    //     // 保存预约信息
    //     try {
    //       let cita = {
    //         active: true,
    //         titulo: values.eventTitle,
    //         startDate: values.eventTime[0].toDate(),
    //         endDate: values.eventTime[1].toDate(),
    //         paciente: userObj.nombre || originalEvent.userObj.nombre,
    //         pacienteCorreo: userObj.correo || originalEvent.userObj.correo,
    //         detalles: values.eventDetails || '',
    //         idDoc: AuthCTX.currentUser.uid,
    //       };
    //       console.log('保存在 BD 中的事件:', cita);
    //       if (!isEdit) {
    //         await setCita(cita);
    //         message.success('约会创建成功');
    //       } else {
    //         await updateCita(cita, originalEvent.id);
    //         message.success('约会更新成功');
    //       }
    //       onCancel();
    //     } catch (e) {
    //       console.error(e);
    //       !isEdit
    //         ? message.error('创建约会时出错')
    //         : message.error('更新约会时出错');
    //     }

    //     form.resetFields();
    //     onCommitChanges({
    //       ...values,
    //       correoPaciente: userObj.correo || originalEvent.userObj.correo,
    //       nombrePaciente: userObj.nombre || originalEvent.userObj.nombre,
    //       nombreDoctor: AuthCTX.currentUser.displayName,
    //     });
    //   })
    //   .catch((info) => {
    //     console.log('Validate Failed:', info);
    //   });
  };

  const onDeleteEvent = ({ id }) => {
    console.log(id);
    swal
      .fire({
        title: '您确定要删除报价吗?',
        showDenyButton: true,
        showCancelButton: true,
        showConfirmButton: false,
        denyButtonText: 'SI',
        cancelButtonText: 'NO',
      })
      .then(async (result) => {
        if (result.isDenied) {
          try {
            await setCita({ active: false }, id);
            message.success('报价已成功删除');
          } catch (error) {
            console.log(error);
            message.error('删除约会失败');
          }
          onCancel();
        }
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
          >
            Delete
          </Button>
        ) : null,
        <Button key="submit" type="primary" onClick={form.submit}>
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
