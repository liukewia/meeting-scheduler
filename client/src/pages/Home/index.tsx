import React, { useContext, useState, Suspense, useEffect } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { history, useModel } from 'umi';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import ThemeContext from '@/contexts/ThemeContext';
import classNames from 'classnames';
import { LOGIN_PATH, REGISTER_PATH, PREFIX_CLS } from '@/constants';
import logoSrc from 'public/logo.svg';
import CenteredSpinner from '@/components/CenteredSpinner';
import { Exception403 } from '@/components/Exceptions';
import { stringify } from 'use-json-comparison';
// import 'antd/dist/antd.css';
import './index.less';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

const Router = () => {};

export default (props) => {
  // to control if logo and title should show
  const [isCollapsed, setIsCollapsed] = useState(false);

  const themeContext = useContext(ThemeContext);
  const { theme, isLightTheme } = themeContext;

  const siderPrefixCls = `${PREFIX_CLS}-layout-sider`;

  return (
    <ThemeContext.Provider value={themeContext}>
      <Layout>
        <Sider
          theme={theme}
          collapsible
          collapsed={isCollapsed}
          collapsedWidth={47}
          onCollapse={setIsCollapsed}
          // className={classNames({
          //   [`${siderPrefixCls}-light`]: isLightTheme,
          // })}
        >
          <div className={`${siderPrefixCls}-logo`}>
            {/* <Logo width={32} height={32} /> */}
            <a>
              <img src={logoSrc} alt="scheduler logo" />
            </a>
            {!isCollapsed && <h1>Scheduler</h1>}
          </div>
          <Menu theme={theme} defaultSelectedKeys={['timetable']} mode="inline">
            <Menu.Item key="timetable" icon={<FileOutlined />}>
              Timetable
            </Menu.Item>
            <Menu.Item key="settings" icon={<FileOutlined />}>
              Settings
            </Menu.Item>
            <SubMenu key="1" icon={<TeamOutlined />} title="Team">
              <Menu.Item key="1.1">Team 1</Menu.Item>
              <Menu.Item key="1.2">Team 2</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>

        <Layout>
          <Header
            className={classNames({
              [`${PREFIX_CLS}-layout-header`]: true,
              [`${PREFIX_CLS}-layout-header-shadow`]: isLightTheme,
            })}
          />
          {/* like ct dashboard 封装pagecontainer */}
          <Content style={{ margin: '16px 16px' }}>
            <Suspense fallback={<CenteredSpinner tip="loading" />}>
              {props.children}
            </Suspense>
          </Content>
        </Layout>
      </Layout>
    </ThemeContext.Provider>
  );
};
