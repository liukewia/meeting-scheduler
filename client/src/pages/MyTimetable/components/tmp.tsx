import { Modal, Form, Input, TimePicker, Button } from 'antd';
import moment from 'moment';

const formLayout = {
  labelCol: { span: 9 },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 10 },
    md: { span: 9 },
    lg: { span: 8 },
    xl: { span: 7 },
    xxl: { span: 6 },
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 9,
    span: 15,
  },
};

const AppointmentFormContainerBasic = (props) => {
  const {
    appointmentData,
    commitChanges,
    visible,
    visibleChange,
    cancelAppointment,
    target,
    onHide,
  } = props;

  const [form] = Form.useForm();
  const { setFieldsValue, getFieldValue, getFieldsValue, submit } =
    form;

  // const changeAppointment = ({ field, changes }) => {
  //   const nextChanges = {
  //     ...appointmentChanges,
  //     [field]: changes,
  //   };
  //   setAppointmentChanges({
  //     appointmentChanges: nextChanges,
  //   });
  // };

  const commitAppointment = (type) => {
    const appointment = {
      ...appointmentData,
      ...getFieldsValue(),
    };
    if (type === 'deleted') {
      commitChanges({ [type]: appointment.id });
    } else if (type === 'changed') {
      commitChanges({ [type]: { [appointment.id]: appointment } });
    } else {
      commitChanges({ [type]: appointment });
    }
  };

  const isNewAppointment = getFieldValue('id') === undefined;

  const applyChanges = isNewAppointment
    ? () => commitAppointment('added')
    : () => commitAppointment('changed');

  const cancelChanges = () => {
    // setFieldsValue({});
    visibleChange();
    cancelAppointment();
  };

  const intialFormValues = {
    title: appointmentData.title,
    location: appointmentData.location,
    time: [moment(appointmentData.startDate), moment(appointmentData.endDate)],
    note: appointmentData.note,
  };

  return (
    <AppointmentForm.Overlay
      visible={visible}
      target={target}
      fullSize
      onHide={onHide}
    >
      <Modal onCancel={cancelChanges} footer={null}>
        <Form
          {...formLayout}
          form={form}
          initialValues={intialFormValues}
          onFinish={() => {
            visibleChange();
            applyChanges();
          }}
        >
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input allowClear />
          </Form.Item>
          <Form.Item
            name="location"
            label="location"
            rules={[{ required: true }]}
          >
            <Input allowClear />
          </Form.Item>
          <Form.Item name="time" label="time" rules={[{ required: true }]}>
            <TimePicker.RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          <Form.Item name="note" label="note">
            <Input.TextArea allowClear />
          </Form.Item>
          <Form.Item {...tailLayout}>
            {!isNewAppointment && (
              <Button
                onClick={() => {
                  visibleChange();
                  commitAppointment('deleted');
                }}
              >
                Delete
              </Button>
            )}
            <Button type="primary" htmlType="submit">
              {isNewAppointment ? 'Create' : 'Save'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </AppointmentForm.Overlay>
  );
};
