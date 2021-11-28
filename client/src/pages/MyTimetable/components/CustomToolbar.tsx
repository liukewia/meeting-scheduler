import React from 'react';
import { Views, Navigate } from 'react-big-calendar';
import { Button, Typography, Row, Space, Select, Tooltip, Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { ToolbarProps, NavigateAction, View } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

interface CustomToolbarProp {
  showCreateForm: () => void;
}

const CustomToolbar: React.FC<ToolbarProps & CustomToolbarProp> = (props) => {
  const { label, showCreateForm } = props;

  const navigate = (action: NavigateAction) => {
    props.onNavigate(action);
  };

  const handleChangeView = (event: RadioChangeEvent) => {
    props.onView(event.target.value);
  };

  return (
    <>
      <Row justify="space-between" align="middle">
        <Row justify="space-around" align="middle">
          <Space size="large">
            <Tooltip title="Go To Today">
              <Button onClick={() => navigate(Navigate.TODAY)}>TODAY</Button>
            </Tooltip>
            <Tooltip title="Create New Event">
              <Button type="default" onClick={showCreateForm}>
                Create
              </Button>
            </Tooltip>
          </Space>
        </Row>
        <Space>
          <Tooltip title="Previous">
            <Button
              type="text"
              shape="circle"
              icon={<LeftOutlined />}
              onClick={() => navigate(Navigate.PREVIOUS)}
            />
          </Tooltip>
          <Row justify="center" align="middle">
            <Typography.Text strong style={{ fontSize: '1.3em' }}>
              {label}
            </Typography.Text>
          </Row>
          <Tooltip title="Next">
            <Button
              type="text"
              shape="circle"
              icon={<RightOutlined />}
              onClick={() => navigate(Navigate.NEXT)}
            />
          </Tooltip>
        </Space>
        <Row justify="space-around" align="middle">
          <Radio.Group
            defaultValue={Views.WEEK}
            value={props.view}
            onChange={handleChangeView}
          >
            <Radio.Button value={Views.MONTH}>Month</Radio.Button>
            <Radio.Button value={Views.WEEK}>Week</Radio.Button>
            <Radio.Button value={Views.DAY}>Day</Radio.Button>
            <Radio.Button value={Views.AGENDA}>Agenda</Radio.Button>
          </Radio.Group>
          {/* <Select
                defaultValue={Views.WEEK}
                style={{ width: 100 }}
                value={props.view}
                onChange={handleChangeView}
              >
                <Option value={Views.MONTH}>Month</Option>
                <Option value={Views.WEEK}>Week</Option>
                <Option value={Views.DAY}>Day</Option>
                <Option value={Views.AGENDA}>Agenda</Option>
              </Select> */}
        </Row>
      </Row>
      <br />
    </>
  );
};

export default CustomToolbar;
