import { useContext, useState, Suspense, useMemo } from 'react';
import { Layout, Menu } from 'antd';
import { Link, history, useModel } from 'umi';
import {
  EllipsisOutlined,
  HomeOutlined,
  CalendarOutlined,
  TeamOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import logoSrc from 'public/logo.svg';
import CenteredSpinner from '@/components/CenteredSpinner';
import { SiderOpenedKey } from '@/constants';

const { Sider } = Layout;
const { SubMenu } = Menu;

const siderItems = [
  {
    key: 'home',
    icon: HomeOutlined,
    label: 'Home',
    href: '/home',
  },
  {
    key: 'timetable',
    icon: CalendarOutlined,
    label: 'My Timetable',
    href: '/timetable',
  },
  {
    key: 'newmeeting',
    icon: TeamOutlined,
    label: 'New Meeting',
    href: '/newmeeting',
  },
  {
    key: 'settings',
    icon: SettingOutlined,
    label: 'Settings',
    children: [
      {
        key: 'settings-site',
        href: '/settings/site',
        label: 'Site Settings',
      },
      {
        key: 'settings-etc',
        href: '/settings/etc',
        label: 'etc',
      },
    ],
  },
  {
    key: 'settings2',
    icon: SettingOutlined,
    label: 'Settings2',
    children: [
      {
        key: 'settings-site2',
        href: '/settings/site2',
        label: 'Site Settings2',
      },
      {
        key: 'settings-etc2',
        href: '/settings/etc2',
        label: 'etc2',
      },
    ],
  },
];

export default ({ siderPrefixCls }: { siderPrefixCls: string }) => {
  // make this a controlled component to control if logo and title should show, and misc selected keys...
  const {
    isCollapsed,
    setIsCollapsed,
    getSelectedKeys,
    setSelectedKeys,
    getOpenedKeys,
    setOpenedKeys,
  } = useModel('sider');

  const { theme, isLightTheme } = useModel('theme', (model) => ({
    theme: model.theme,
    isLightTheme: model.isLightTheme,
  }));

  const openedKeysMemo = useMemo(() => {
    if (isCollapsed) {
      // if the sider is collapsed, remember the last opened keys, and
      return getOpenedKeys();
    }
  }, [isCollapsed]);

  // console.log('isCollapsed: ', isCollapsed);
  return (
    <Sider
      theme={theme}
      collapsible
      collapsed={isCollapsed}
      collapsedWidth={47}
      onCollapse={(bool) => {
        setIsCollapsed(bool);
        if (!bool) {
          setOpenedKeys(openedKeysMemo);
        }
      }}
      // className={classNames({
      //   [`${siderPrefixCls}-light`]: isLightTheme,
      // })}
    >
      <div
        className={`${siderPrefixCls}-logo`}
        onClick={() => history.push('/home')}
      >
        <a>
          <img src={logoSrc} alt="scheduler logo" />
        </a>
        {!isCollapsed && <h1>Scheduler</h1>}
      </div>
      <Menu
        mode="inline"
        theme={theme}
        defaultSelectedKeys={getSelectedKeys()}
        // selectedKeys={selectedKeys}
        defaultOpenKeys={getOpenedKeys()}
        // openKeys={openedKeys}
        onOpenChange={(newKeys) => setOpenedKeys(newKeys)}
        // overflowedIndicator={<EllipsisOutlined />}
      >
        {siderItems.map((item) => {
          if (item.children) {
            return (
              <SubMenu key={item.key} icon={<item.icon />} title={item.label}>
                {item.children.map((subItem) => (
                  <Menu.Item
                    key={subItem.key}
                    onClick={({ key }) => setSelectedKeys([key])}
                  >
                    <Link to={subItem.href}>{subItem.label}</Link>
                  </Menu.Item>
                ))}
              </SubMenu>
            );
          } else {
            return (
              <Menu.Item
                key={item.key}
                icon={<item.icon />}
                onClick={({ key }) => setSelectedKeys([key])}
              >
                <Link to={item.href}>{item.label}</Link>
              </Menu.Item>
            );
          }
        })}
      </Menu>
    </Sider>
  );
};
