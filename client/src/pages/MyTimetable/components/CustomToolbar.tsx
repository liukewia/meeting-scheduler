import React from 'react';
import { Views, Navigate } from 'react-big-calendar';
import { Button, Typography, Row, Space, Select, Tooltip } from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  CalendarOutlined,
  PlusCircleTwoTone,
} from '@ant-design/icons';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const { Title } = Typography;
const { Option } = Select;

class CustomToolbar extends React.Component {
  constructor(props: any) {
    super(props);
  }

  navigate = (action) => {
    this.props.onNavigate(action);
  };

  handleChangeView = (view) => {
    this.props.onView(view);
  };

  render() {
    const { label, showCreateModalProp } = this.props;
    return (
      <>
        <Row justify="space-between" align="middle">
          <Row justify="space-around" align="middle">
            <Button
              type="text"
              shape="circle"
              icon={<CalendarOutlined />}
              size="large"
              onClick={this.navigate.bind(null, Navigate.TODAY)}
            >
              TODAY
            </Button>
            <Button
              type="text"
              shape="circle"
              icon={<LeftOutlined />}
              size="large"
              onClick={this.navigate.bind(null, Navigate.PREVIOUS)}
            />
            <Button
              type="text"
              shape="circle"
              icon={<RightOutlined />}
              size="large"
              onClick={this.navigate.bind(null, Navigate.NEXT)}
            />
          </Row>
          <Row justify="space-around" align="middle">
            <Title level={5}>{label}</Title>
          </Row>
          <Row justify="space-around" align="middle">
            <Space size={10}>
              <Button
                type="default"
                size="large"
                // icon={
                //   <PlusCircleTwoTone
                //     style={{
                //       display: 'inline-block',
                //       verticalAlign: 'initial',
                //     }}
                //   />
                // }
                onClick={showCreateModalProp}
              >
                Create
              </Button>
              <Select
                defaultValue={Views.WEEK}
                size="large"
                style={{ width: 100 }}
                bordered={true}
                onChange={this.handleChangeView}
              >
                <Option value={Views.MONTH}>MONTH</Option>
                <Option value={Views.WEEK}>WEEK</Option>
                <Option value={Views.DAY}>DAY</Option>
                <Option value={Views.AGENDA}>AGENDA</Option>
              </Select>
            </Space>
          </Row>
        </Row>
        <br />
      </>
    );
  }
}

export default CustomToolbar;
