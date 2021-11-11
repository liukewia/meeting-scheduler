import React, { useContext } from 'react';
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
import './index.less';
import { PREFIX_CLS } from '@/constants';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

export default () => {
  // state = {
  //   collapsed: false,
  // };

  const onCollapse = (collapsed: boolean) => {
    console.log(collapsed);
    // this.setState({ collapsed });
  };

  const themeContext = useContext(ThemeContext);
  const { theme, isLightTheme } = themeContext;

  const siderPrefixCls = `${PREFIX_CLS}-sider`;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <ThemeContext.Provider value={themeContext}>
        <Sider
          theme={theme}
          collapsible
          // collapsed={collapsed}
          collapsedWidth={47}
          onCollapse={onCollapse}
          className={classNames({
            [`${siderPrefixCls}-shadow`]: isLightTheme,
          })}
        >
          <div className={`${siderPrefixCls}-logo`} />
          <Menu theme={theme} defaultSelectedKeys={['6']} mode="inline">
            <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
              <Menu.Item key="6">Team 1</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="9" icon={<FileOutlined />}>
              Account
            </Menu.Item>
          </Menu>
        </Sider>
      </ThemeContext.Provider>

      <Layout>
        <Header
          className={classNames({
            [`${PREFIX_CLS}-layout-header`]: true,
            [`${PREFIX_CLS}-layout-header-shadow`]: isLightTheme,
          })}
        />
        {/* like ct dashboard 封装pagecontainer */}
        <Content style={{ margin: '16px 16px' }}>
          {/* <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb> */}
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            Bill is a cat.
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
