import React from 'react';
import { Views, Navigate } from 'react-big-calendar';
import { Button, Typography, Row, Space, Select, Tooltip } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { ToolbarProps, NavigateAction, View } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const { Title } = Typography;
const { Option } = Select;

interface CustomToolbarProp {
  showCreateForm: () => void;
}

const CustomToolbar: React.FC<ToolbarProps & CustomToolbarProp> = (props) => {
  const { label, showCreateForm } = props;

  const navigate = (action: NavigateAction) => {
    props.onNavigate(action);
  };

  const handleChangeView = (view: View) => {
    props.onView(view);
  };

  return (
    <>
      <Row justify="space-between" align="middle">
        <Row justify="space-around" align="middle">
          <Space>
            <Tooltip title="Go To Today">
              <Button onClick={() => navigate(Navigate.TODAY)}>TODAY</Button>
            </Tooltip>
            <Tooltip title="Previous">
              <Button
                type="text"
                shape="circle"
                icon={<LeftOutlined />}
                onClick={() => navigate(Navigate.PREVIOUS)}
              />
            </Tooltip>
            <Tooltip title="Next">
              <Button
                type="text"
                shape="circle"
                icon={<RightOutlined />}
                onClick={() => navigate(Navigate.NEXT)}
              />
            </Tooltip>
          </Space>
        </Row>
        <Row justify="space-around" align="middle">
          <Title level={5}>{label}</Title>
        </Row>
        <Row justify="space-around" align="middle">
          <Space size={20}>
            <Tooltip title="Create New Event">
              <Button
                type="default"
                onClick={showCreateForm}
              >
                Create
              </Button>
            </Tooltip>
            <Tooltip title="Select View">
              <Select
                defaultValue={Views.WEEK}
                style={{ width: 100 }}
                value={props.view}
                onChange={handleChangeView}
              >
                <Option value={Views.MONTH}>Month</Option>
                <Option value={Views.WEEK}>Week</Option>
                <Option value={Views.DAY}>Day</Option>
                <Option value={Views.AGENDA}>Agenda</Option>
              </Select>
            </Tooltip>
          </Space>
        </Row>
      </Row>
      <br />
    </>
  );
};

export default CustomToolbar;
