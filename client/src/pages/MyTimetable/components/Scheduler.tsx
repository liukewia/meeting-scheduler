import Paper from '@material-ui/core/Paper';
import { ViewState, EditingState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  Toolbar,
  MonthView,
  WeekView,
  ViewSwitcher,
  Appointments,
  DateNavigator,
  AppointmentTooltip,
  AppointmentForm,
  DragDropProvider,
  EditRecurrenceMenu,
  TodayButton,
  AllDayPanel,
} from '@devexpress/dx-react-scheduler-material-ui';
import { connectProps } from '@devexpress/dx-react-core';
import { Modal, Form, Input, DatePicker, Button, Space } from 'antd';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';

import { appointments } from '../demo-data/appointments';
import { useEffect } from 'react';
const { RangePicker } = DatePicker;
// const containerStyles = (theme) => ({
//   container: {
//     width: theme.spacing(68),
//     padding: 0,
//     paddingBottom: theme.spacing(2),
//   },
//   content: {
//     padding: theme.spacing(2),
//     paddingTop: 0,
//   },
//   header: {
//     overflow: 'hidden',
//     paddingTop: theme.spacing(0.5),
//   },
//   closeButton: {
//     float: 'right',
//   },
//   buttonGroup: {
//     display: 'flex',
//     justifyContent: 'flex-end',
//     padding: theme.spacing(0, 2),
//   },
//   button: {
//     marginLeft: theme.spacing(2),
//   },
//   picker: {
//     marginRight: theme.spacing(2),
//     '&:last-child': {
//       marginRight: 0,
//     },
//     width: '50%',
//   },
//   wrapper: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     padding: theme.spacing(1, 0),
//   },
//   icon: {
//     margin: theme.spacing(2, 0),
//     marginRight: theme.spacing(2),
//   },
//   textField: {
//     width: '100%',
//   },
// });

// class AppointmentFormContainerBasic extends React.PureComponent {
//   constructor(props) {
//     super(props);

//     this.state = {
//       appointmentChanges: {},
//     };

//     this.getAppointmentData = () => {
//       const { appointmentData } = this.props;
//       return appointmentData;
//     };
//     this.getAppointmentChanges = () => {
//       const { appointmentChanges } = this.state;
//       return appointmentChanges;
//     };

//     this.changeAppointment = this.changeAppointment.bind(this);
//     this.commitAppointment = this.commitAppointment.bind(this);
//   }

//   changeAppointment({ field, changes }) {
//     const nextChanges = {
//       ...this.getAppointmentChanges(),
//       [field]: changes,
//     };
//     this.setState({
//       appointmentChanges: nextChanges,
//     });
//   }

//   commitAppointment(type) {
//     const { commitChanges } = this.props;
//     const appointment = {
//       ...this.getAppointmentData(),
//       ...this.getAppointmentChanges(),
//     };
//     if (type === 'deleted') {
//       commitChanges({ [type]: appointment.id });
//     } else if (type === 'changed') {
//       commitChanges({ [type]: { [appointment.id]: appointment } });
//     } else {
//       commitChanges({ [type]: appointment });
//     }
//     this.setState({
//       appointmentChanges: {},
//     });
//   }

//   render() {
//     console.log(this.props);
//     const {
//       classes,
//       visible,
//       visibleChange,
//       appointmentData,
//       cancelAppointment,
//       target,
//       onHide,
//     } = this.props;
//     const { appointmentChanges } = this.state;

//     const displayAppointmentData = {
//       ...appointmentData,
//       ...appointmentChanges,
//     };

//     const isNewAppointment = appointmentData.id === undefined;
//     const applyChanges = isNewAppointment
//       ? () => this.commitAppointment('added')
//       : () => this.commitAppointment('changed');

//     const textEditorProps = (field) => ({
//       variant: 'outlined',
//       onChange: ({ target: change }) =>
//         this.changeAppointment({
//           field: [field],
//           changes: change.value,
//         }),
//       value: displayAppointmentData[field] || '',
//       label: field[0].toUpperCase() + field.slice(1),
//       className: classes.textField,
//     });

//     const pickerEditorProps = (field) => ({
//       className: classes.picker,
//       // keyboard: true,
//       ampm: false,
//       value: displayAppointmentData[field],
//       onChange: (date) =>
//         this.changeAppointment({
//           field: [field],
//           changes: date
//             ? date.toDate()
//             : new Date(displayAppointmentData[field]),
//         }),
//       inputVariant: 'outlined',
//       format: 'DD/MM/YYYY HH:mm',
//       onError: () => null,
//     });

//     const cancelChanges = () => {
//       this.setState({
//         appointmentChanges: {},
//       });
//       visibleChange();
//       cancelAppointment();
//     };

//     return (
//       <AppointmentForm.Overlay
//         visible={visible}
//         target={target}
//         fullSize
//         onHide={onHide}
//       >
//         <div>
//           <div className={classes.header}>
//             <IconButton className={classes.closeButton} onClick={cancelChanges}>
//               <Close color="action" />
//             </IconButton>
//           </div>
//           <div className={classes.content}>
//             <div className={classes.wrapper}>
//               <Create className={classes.icon} color="action" />
//               <TextField {...textEditorProps('title')} />
//             </div>
//             <div className={classes.wrapper}>
//               <CalendarToday className={classes.icon} color="action" />
//               <MuiPickersUtilsProvider utils={MomentUtils}>
//                 <KeyboardDateTimePicker
//                   label="Start Date"
//                   {...pickerEditorProps('startDate')}
//                 />
//                 <KeyboardDateTimePicker
//                   label="End Date"
//                   {...pickerEditorProps('endDate')}
//                 />
//               </MuiPickersUtilsProvider>
//             </div>
//             <div className={classes.wrapper}>
//               <LocationOn className={classes.icon} color="action" />
//               <TextField {...textEditorProps('location')} />
//             </div>
//             <div className={classes.wrapper}>
//               <Notes className={classes.icon} color="action" />
//               <TextField {...textEditorProps('notes')} multiline rows="6" />
//             </div>
//           </div>
//           <div className={classes.buttonGroup}>
//             {!isNewAppointment && (
//               <Button
//                 variant="outlined"
//                 color="secondary"
//                 className={classes.button}
//                 onClick={() => {
//                   visibleChange();
//                   this.commitAppointment('deleted');
//                 }}
//               >
//                 Delete
//               </Button>
//             )}
//             <Button
//               variant="outlined"
//               color="primary"
//               className={classes.button}
//               onClick={() => {
//                 visibleChange();
//                 applyChanges();
//               }}
//             >
//               {isNewAppointment ? 'Create' : 'Save'}
//             </Button>
//           </div>
//         </div>
//       </AppointmentForm.Overlay>
//     );
//   }
// }

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 8,
  },
};

const AppointmentFormContainer = (props) => {
  const {
    appointmentData,
    commitChanges,
    visible,
    visibleChange,
    cancelAppointment,
    target,
    // onHide,
  } = props;

  console.log('appointmentData: ', appointmentData);
  const [form] = Form.useForm();
  const { setFieldsValue, getFieldValue, getFieldsValue, submit } = form;

  // const changeAppointment = ({ field, changes }) => {
  //   const nextChanges = {
  //     ...appointmentChanges,
  //     [field]: changes,
  //   };
  //   setAppointmentChanges({
  //     appointmentChanges: nextChanges,
  //   });
  // };
  console.log('re-rendered');

  const commitAppointment = (type) => {
    console.log('committed, type = ', type);
    const appointment = {
      ...appointmentData,
      title: getFieldValue('title'),
      location: getFieldValue('location'),
      startDate: getFieldValue('time')[0].toDate(),
      endDate: getFieldValue('time')[1].toDate(),
      note: getFieldValue('note'),
    };
    console.log('appointment: ', appointment);
    if (type === 'deleted') {
      commitChanges({ [type]: appointment.id });
    } else if (type === 'changed') {
      commitChanges({ [type]: { [appointment.id]: appointment } });
    } else {
      // add
      commitChanges({ [type]: appointment });
    }
  };

  const isNewAppointment = appointmentData.id === undefined;
  console.log('isNewAppointment: ', isNewAppointment);
  const applyChanges = isNewAppointment
    ? () => commitAppointment('added')
    : () => commitAppointment('changed');

  const cancelChanges = () => {
    console.log('canceled');
    setFieldsValue({});
    visibleChange();
    // onHide();
    cancelAppointment();
  };

  useEffect(() => {
    setFieldsValue({
      title: appointmentData.title,
      location: appointmentData.location,
      time: [
        moment(appointmentData.startDate),
        moment(appointmentData.endDate),
      ],
      note: appointmentData.note,
    });
  }, [appointmentData]);

  return (
    <Modal
      forceRender
      width={800}
      title={isNewAppointment ? 'Create' : 'Edit' + ' Event'}
      visible={visible}
      onCancel={cancelChanges}
      footer={[
        !isNewAppointment && (
          <Button
            key="delete"
            onClick={() => {
              console.log('deleted');
              visibleChange();
              commitAppointment('deleted');
            }}
          >
            Delete
          </Button>
        ),
        <Button key="submit" type="primary" onClick={submit}>
          {isNewAppointment ? 'Create' : 'Save'}
        </Button>,
      ]}
    >
      <Form
        {...formLayout}
        form={form}
        // initialValues={intialFormValues}
        onFinish={() => {
          visibleChange();
          applyChanges();
          setFieldsValue({});
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
          <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item name="note" label="note">
          <Input.TextArea allowClear />
        </Form.Item>
        {/* <Form.Item {...tailLayout}>
          <Space size="large">
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
          </Space>
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

const styles = (theme) => ({
  addButton: {
    position: 'absolute',
    bottom: theme.spacing(1) * 3,
    right: theme.spacing(1) * 4,
  },
});

class MyScheduler extends React.PureComponent {
  constructor(props) {
    super(props);
    this.lightTheme = createTheme({
      palette: {
        type: 'light',
        primary: blue,
      },
      typography: {
        useNextVariants: true,
      },
    });

    this.darkTheme = createTheme({
      palette: {
        type: 'dark',
        primary: blue,
      },
      typography: {
        useNextVariants: true,
      },
    });
    this.state = {
      data: appointments,
      currentDate: '2018-06-27',
      editingFormVisible: false,
      editingAppointment: undefined,
      previousAppointment: undefined,
      addedAppointment: {},
      isNewAppointment: false,
      theme: 'light',
    };

    this.toggleEditingFormVisibility =
      this.toggleEditingFormVisibility.bind(this);

    this.commitChanges = this.commitChanges.bind(this);
    this.onEditingAppointmentChange =
      this.onEditingAppointmentChange.bind(this);
    this.onAddedAppointmentChange = this.onAddedAppointmentChange.bind(this);
    this.toggle = this.toggle.bind(this);

    this.appointmentForm = connectProps(AppointmentFormContainer, () => {
      const {
        editingFormVisible,
        editingAppointment,
        data,
        addedAppointment,
        isNewAppointment,
        previousAppointment,
      } = this.state;

      const currentAppointment =
        data.filter(
          (appointment) =>
            editingAppointment && appointment.id === editingAppointment.id,
        )[0] || addedAppointment;

      const cancelAppointment = () => {
        if (isNewAppointment) {
          this.setState({
            editingAppointment: previousAppointment,
            isNewAppointment: false,
          });
        }
      };

      return {
        visible: editingFormVisible,
        appointmentData: currentAppointment,
        commitChanges: this.commitChanges,
        visibleChange: this.toggleEditingFormVisibility,
        onEditingAppointmentChange: this.onEditingAppointmentChange,
        cancelAppointment,
      };
    });
  }

  componentDidUpdate() {
    this.appointmentForm.update();
  }

  onEditingAppointmentChange(editingAppointment) {
    this.setState({ editingAppointment });
  }

  onAddedAppointmentChange(addedAppointment) {
    this.setState({ addedAppointment });
    const { editingAppointment } = this.state;
    if (editingAppointment !== undefined) {
      this.setState({
        previousAppointment: editingAppointment,
      });
    }
    this.setState({ editingAppointment: undefined, isNewAppointment: true });
  }

  toggleEditingFormVisibility() {
    const { editingFormVisible } = this.state;
    this.setState({
      editingFormVisible: !editingFormVisible,
    });
  }

  commitChanges({ added, changed, deleted }) {
    console.log('added: ', added);
    console.log('deleted: ', deleted);
    this.setState((state) => {
      let { data } = state;
      console.log('data: ', data);
      if (added) {
        const startingAddedId =
          data.length > 0 ? data[data.length - 1].id + 1 : 0;
        data = [...data, { id: startingAddedId, ...added }];
      }
      if (changed) {
        data = data.map((appointment) =>
          changed[appointment.id]
            ? { ...appointment, ...changed[appointment.id] }
            : appointment,
        );
      }
      // deleted event may have id 0, so should check undefined*
      if (deleted !== undefined) {
        data = data.filter((appointment) => appointment.id !== deleted);
      }
      return { data, addedAppointment: {} };
    });
  }

  toggle() {
    const { theme } = this.state;
    console.log(theme);
    this.setState({
      ...this.state,
      theme: theme === 'light' ? 'dark' : 'light',
    });
  }

  render() {
    console.log('data: ', this.state.data);
    const { currentDate, data, editingFormVisible } = this.state;

    return (
      <MuiThemeProvider
        theme={this.state.theme === 'light' ? this.lightTheme : this.darkTheme}
      >
        <Paper>
          <Button onClick={this.toggle}>aaa</Button>
          {/* paper包裹，用来填充cell里面的暗色 */}
          <Scheduler data={data} theme={'dark'}>
            <ViewState currentDate={currentDate} />
            <EditingState
              onCommitChanges={this.commitChanges}
              onEditingAppointmentChange={this.onEditingAppointmentChange}
              onAddedAppointmentChange={this.onAddedAppointmentChange}
            />
            <WeekView />
            <MonthView />
            <AllDayPanel />
            <EditRecurrenceMenu />
            <Appointments
              appointmentComponent={({
                onClick,
                onDoubleClick,
                ...restProps
              }) => {
                return (
                  <Appointments.Appointment
                    onClick={onDoubleClick}
                    {...restProps}
                  />
                );
              }}
            />
            {/* <AppointmentTooltip
              showOpenButton
              showCloseButton
              showDeleteButton
            /> */}
            <Toolbar />
            <DateNavigator />
            <TodayButton />
            <ViewSwitcher />
            <AppointmentForm
              overlayComponent={this.appointmentForm}
              visible={editingFormVisible}
              onVisibilityChange={this.toggleEditingFormVisibility}
            />
            <DragDropProvider />
          </Scheduler>

          {/* <Dialog open={confirmationVisible} onClose={this.cancelDelete}>
              <DialogTitle>Delete Appointment</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete this appointment?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={this.toggleConfirmationVisible}
                  color="primary"
                  variant="outlined"
                >
                  Cancel
                </Button>
                <Button
                  onClick={this.commitDeletedAppointment}
                  color="secondary"
                  variant="outlined"
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          */}
          {/* <Fab
              color="secondary"
              className={classes.addButton}
              onClick={() => {
                this.setState({ editingFormVisible: true });
                this.onEditingAppointmentChange(undefined);
                this.onAddedAppointmentChange({
                  startDate: new Date(currentDate).setHours(startDayHour),
                  endDate: new Date(currentDate).setHours(startDayHour + 1)
                });
              }}
            >
              <AddIcon />
            </Fab> */}
        </Paper>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles, { name: 'MyScheduler' })(MyScheduler);
