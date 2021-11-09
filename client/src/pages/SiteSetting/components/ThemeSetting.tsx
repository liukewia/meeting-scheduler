import { Button, Col, List, message, Row, Select, Switch } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React, { Fragment, useEffect, useState } from 'react';
import ColorPicker from '@/components/ColorPicker';
import lightVars from '../resources/light.json';
import darkVars from '../resources/dark.json';

// type Unpacked<T> = T extends (infer U)[] ? U : T;

const { Option } = Select;
const themeLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

// utility method
const getInitialAppColors = () => {
  let vars;
  try {
    vars = localStorage.getItem('app-colors');
    if (!vars) {
      vars = lightVars;
    } else {
      vars = Object.assign({}, JSON.parse(vars));
    }
  } catch (e) {
    vars = lightVars;
  }
  return vars;
};

const NotificationView: React.FC = () => {
  const [themeName, setThemeName] = useState(localStorage.getItem('app-theme') || 'light');

  const [themeColors, setThemeColors] = useState(getInitialAppColors());

  useEffect(() => {
    // @ts-ignore
    window.less.modifyVars(themeColors).catch(() => {
      message.error(`Failed to update theme`);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = () => {
    const Action = <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked />;
    return [
      {
        title: '账户密码',
        // description: '其他用户的消息将以站内信的形式通知',
        actions: [Action],
      },
      {
        title: '系统消息',
        // description: '系统消息将以站内信的形式通知',
        actions: [Action],
      },
      {
        title: '待办任务',
        // description: '待办任务将以站内信的形式通知',
        actions: [Action],
      },
    ];
  };
  const resetTheme = () => {
    localStorage.setItem("app-theme", "{}");
    localStorage.setItem("theme-name", 'light');
    setThemeName('light')
    setThemeColors(lightVars);
    window.less.modifyVars(lightVars).catch(error => {
      message.error(`Failed to reset theme`);
    });
  };

  const data = getData();
  return (
    <Fragment>
      {/* <List<Unpacked<typeof data>>
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta title={item.title} />
          </List.Item>
        )}
      /> */}

      <Row>
        <Col span={22} offset={1}>
          <FormItem
            {...themeLayout}
            label="Choose Theme"
            className="ant-col ant-col-xs-22 ant-col-offset-1 choose-theme"
          >
            <Select
              placeholder="Please select theme"
              value={themeName}
              onSelect={(value) => {
                let vars = value === 'light' ? lightVars : darkVars;
                vars = { ...vars, '@white': '#fff', '@black': '#000' };
                setThemeName(value);
                setThemeColors(vars);
                localStorage.setItem('app-colors', JSON.stringify(vars));
                localStorage.setItem('app-theme', value);
                window.less.modifyVars(vars).catch((error) => {});
              }}
            >
              <Option value="light">Light</Option>
              <Option value="dark">Dark</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row justify="center">
        <Button type="primary" onClick={resetTheme} title="Reset Theme">
          'Reset Theme'
        </Button>
      </Row>
    </Fragment>
  );
};

export default NotificationView;
