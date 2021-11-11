import React, { useContext, useState } from 'react';
import ReactDOM from 'react-dom';
// import 'antd/dist/antd.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import ThemeContext from '@/contexts/ThemeContext';
import classNames from 'classnames';
import { PREFIX_CLS } from '@/constants';
import logoSrc from './logo.svg';
import './index.less';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

export default () => {
  // used to control if logo and title should show
  const [isCollapsed, setIsCollapsed] = useState(false);

  const themeContext = useContext(ThemeContext);
  const { theme, isLightTheme } = themeContext;

  const siderPrefixCls = `${PREFIX_CLS}-layout-sider`;

  return (
    <ThemeContext.Provider value={themeContext}>
      <Layout style={{ minHeight: '100vh' }}>
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
          <Menu theme={theme} defaultSelectedKeys={['setting']} mode="inline">
            <Menu.Item key="setting" icon={<FileOutlined />}>
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
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              Bill is a cat.
            </div>
          </Content>
        </Layout>
      </Layout>
    </ThemeContext.Provider>
  );
};
