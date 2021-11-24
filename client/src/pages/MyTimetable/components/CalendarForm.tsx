import React, { useContext, useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Button,
  AutoComplete,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import DataContext from "../../context/data-context";
import { setCita, updateCita } from "../../firebase/firebase";
import "../../style/calendar.css";
import { formRules, mapCalendarPacientes } from "./CalendarConfig";

const { RangePicker } = DatePicker;

const CalendarForm = ({
  visible,
  title,
  isEdit,
  onCreate,
  onCancel,
  selectedEvent,
  editMode,
}) => {
  const [form] = Form.useForm();
  const { citas, expedientes } = useContext(DataContext);

  const [mappedExpedientes, setMappedExpedientes] = useState([]);
  const [userObj, setUserObj] = useState({});

  useEffect(() => {
    console.log("在表格中运行side effect");
    if (visible) form.resetFields();
    if (expedientes && expedientes.length !== 0)
      setMappedExpedientes(mapCalendarPacientes(expedientes));
  }, [expedientes, selectedEvent, visible, form]);

  const onSubmitForm = (originalEvent) => {
    console.warn("我进入onSubmitForm，它是编辑模式?", isEdit);
    console.log("Data original (OnClick): ", originalEvent);
    form
      .validateFields()
      .then(async (values) => {
        // 保存预约信息
        try {
          let cita = {
            active: true,
            titulo: values.eventTitle,
            startDate: values.eventTime[0].toDate(),
            endDate: values.eventTime[1].toDate(),
            paciente: userObj.nombre || originalEvent.userObj.nombre,
            pacienteCorreo: userObj.correo || originalEvent.userObj.correo,
            detalles: values.eventDetails || "",
            idDoc: AuthCTX.currentUser.uid,
          };
          console.log("保存在 BD 中的事件:", cita);
          if (!isEdit) {
            await setCita(cita);
            message.success("约会创建成功");
          } else {
            await updateCita(cita, originalEvent.id);
            message.success("约会更新成功");
          }
          onCancel();
        } catch (e) {
          console.error(e);
          !isEdit
            ? message.error("创建约会时出错")
            : message.error("更新约会时出错");
        }

        form.resetFields();
        onCreate({
          ...values,
          correoPaciente: userObj.correo || originalEvent.userObj.correo,
          nombrePaciente: userObj.nombre || originalEvent.userObj.nombre,
          nombreDoctor: AuthCTX.currentUser.displayName,
        });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const onDeleteEvent = ({ id }) => {
    console.log(id);
    swal
      .fire({
        title: "您确定要删除报价吗?",
        showDenyButton: true,
        showCancelButton: true,
        showConfirmButton: false,
        denyButtonText: "SI",
        cancelButtonText: "NO",
      })
      .then(async (result) => {
        if (result.isDenied) {
          try {
            await setCita({ active: false }, id);
            message.success("报价已成功删除");
          } catch (error) {
            console.log(error);
            message.error("删除约会失败");
          }
          onCancel();
        }
      });
  };

  // TODO: 如果正在编辑事件，请忽略此引用
  const overlapRule = {
    validator: async (_, eventTime) => {
      if (eventTime && citas !== [] && citas[0]) {
        const initialDay = eventTime[0].toDate();
        const endDay = eventTime[1].toDate();
        initialDay.setSeconds(0);
        endDay.setSeconds(0);
        const citasDiaInicio = citas.filter((cita) => {
          return cita.start.toDateString() === initialDay.toDateString()
            ? true
            : false;
        });
        for (let cita of citasDiaInicio) {
          // * 要安排的约会时间与另一个现有约会的时间不同
          if (initialDay.toTimeString() === cita.start.toTimeString()) {
            return Promise.reject(new Error("开始时间与另一个约会相同。"));
          }
          // * 要安排的约会时间不在另一个现有约会的范围内
          else if (
            cita.start.toTimeString() < initialDay.toTimeString() &&
            cita.end.toTimeString() > initialDay.toTimeString()
          ) {
            return Promise.reject(new Error("开始时间与另一个约会冲突"));
          }
          // * 要安排的约会时间不在两次约会之间的间隙
          else if (
            initialDay.toTimeString() < cita.start.toTimeString() &&
            endDay.toTimeString() > cita.start.toTimeString()
          ) {
            return Promise.reject(new Error("结束时间与另一个日期冲突"));
          }
        }
      }
    },
  };

  const createFooter = [
    <Button key="back" onClick={onCancel}>
      返回
    </Button>,
    <Button
      key="submit"
      type="primary"
      onClick={() => onSubmitForm(selectedEvent)}
    >
      保持
    </Button>,
  ];

  const deleteButton = (
    <Button
      key="delete"
      type="danger"
      onClick={() => onDeleteEvent(selectedEvent)}
    >
      删除约会
    </Button>
  );

  return (
    <Modal
      centered
      visible={visible}
      title={title}
      onCancel={onCancel}
      footer={isEdit ? [...createFooter, deleteButton] : createFooter}
    >
      <Form
        name="event"
        form={form}
        layout="vertical"
        initialValues={selectedEvent}
      >
        <Form.Item
          name="pacienteDetails"
          label="患者姓名"
          required
          tooltip="此字段是必需的"
          rules={formRules.patientNameRules}
        >
          <AutoComplete
            options={mappedExpedientes}
            placeholder="Paciente"
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
            onSelect={(value, { pacienteObj }) => {
              setUserObj(pacienteObj);
            }}
            bordered={editMode}
            disabled={!editMode}
          />
        </Form.Item>

        <Form.Item
          name="eventTitle"
          label="资质"
          required
          tooltip="此字段是必需的"
          rules={formRules.titleRules}
        >
          <Input placeholder="职称" bordered={editMode} disabled={!editMode} />
        </Form.Item>

        <Form.Item
          name="eventTime"
          label="约会的开始和预期结束"
          required
          tooltip="此字段是必需的"
          rules={
            !isEdit
              ? [...formRules.eventTimeRules, overlapRule]
              : formRules.eventTimeRules
          }
        >
          <RangePicker
            locale={locale}
            showTime={{ format: "hh:mm a" }}
            format="DD/MM/YYYY hh:mm a"
            placeholder={["Inicio", "Fin"]}
            bordered={editMode}
            disabled={!editMode}
          />
        </Form.Item>

        <Form.Item
          name="eventDetails"
          label="额外细节"
          tooltip={{
            title: "这是个可选的选项",
            icon: <InfoCircleOutlined />,
          }}
        >
          <Input.TextArea
            placeholder="其他预约信息"
            bordered={editMode}
            disabled={!editMode}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CalendarForm;
