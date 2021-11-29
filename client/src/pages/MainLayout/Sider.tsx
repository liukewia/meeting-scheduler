import { useMemo, useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link, history, useModel } from 'umi';
import {
  HomeOutlined,
  CalendarOutlined,
  TeamOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import logoSrc from 'public/logo.svg';
import { businessTitle } from '@/constants';

const { Sider } = Layout;
const { SubMenu } = Menu;

export const siderItems = [
  {
    key: 'home',
    icon: HomeOutlined,
    label: 'Home',
    path: '/home',
  },
  {
    key: 'timetable',
    icon: CalendarOutlined,
    label: 'My Timetable',
    path: '/timetable',
  },
  {
    key: 'newmeeting',
    icon: TeamOutlined,
    label: 'New Meeting',
    path: '/newmeeting',
  },
  {
    key: 'settings',
    icon: SettingOutlined,
    label: 'Settings',
    children: [
      {
        key: 'settings-site',
        path: '/settings/site',
        label: 'Site Settings',
      },
      // {
      //   key: 'settings-account',
      //   path: '/settings/account',
      //   label: 'Account Settings',
      // },
    ],
  },
];

export default ({ siderPrefixCls }: { siderPrefixCls: string }) => {
  // make this a controlled component to control if logo and title should show
  const { isCollapsed, setIsCollapsed } = useModel('sider');

  // get correct selected keys and opened keys when opening an url
  const { initSelectedKeys, initOpenedKeys } = useMemo(() => {
    const initSelectedKeys: string[] = [];
    const initOpenedKeys: string[] = [];
    const pathname = history.location.pathname.replace(/\/$/, '');
    const match = (routes: any) =>
      routes.some((item: any) => {
        if (item.children) {
          return match(item.children);
        }
        return item.path === pathname;
      });
    if (!match(siderItems)) {
      return { initSelectedKeys, initOpenedKeys };
    }
    const tmp = pathname.split('/').filter((e) => e !== '');
    const selectedKey = tmp.join('-');
    initSelectedKeys.push(selectedKey);
    const superOpenedKey = tmp.slice(0, tmp.length - 1);
    if (superOpenedKey.length) {
      initOpenedKeys.push(superOpenedKey.join('/'));
    }
    return { initSelectedKeys, initOpenedKeys };
  }, [history.location.pathname]);

  // two controlled values
  const [selectedKeys, setSelectedKeys] = useState(initSelectedKeys);
  const [openedKeys, setOpenedKeys] = useState(initOpenedKeys);

  // on reload by url
  useEffect(() => {
    setSelectedKeys(initSelectedKeys);
  }, [initSelectedKeys]);

  useEffect(() => {
    setOpenedKeys(initOpenedKeys);
  }, [initOpenedKeys]);

  const memoizedOpenedKeys = useMemo(() => {
    if (isCollapsed) {
      return openedKeys;
    }
  }, [isCollapsed]);

  useEffect(() => {
    isCollapsed && setOpenedKeys([]);
  }, []);

  const { appTheme } = useModel('theme', (model) => ({
    appTheme: model.appTheme,
  }));

  return (
    <Sider
      theme={appTheme}
      collapsible
      collapsed={isCollapsed}
      collapsedWidth={47}
      onCollapse={(bool) => {
        if (!bool) {
          setTimeout(() => setOpenedKeys(memoizedOpenedKeys || []));
        }
        setIsCollapsed(bool);
      }}
      // https://chinese.freecodecamp.org/news/fixed-side-and-bottom-navbar-with-css-flexbox/
      style={{ overflowY: 'scroll' }}
    >
      <div
        className={`${siderPrefixCls}-logo`}
        onClick={() => history.push('/home')}
      >
        <a>
          <img src={logoSrc} alt="scheduler logo" />
        </a>
        {!isCollapsed && <h1>{businessTitle}</h1>}
      </div>
      <Menu
        mode="inline"
        theme={appTheme}
        defaultSelectedKeys={initSelectedKeys}
        selectedKeys={selectedKeys}
        defaultOpenKeys={initOpenedKeys}
        openKeys={openedKeys}
        onOpenChange={setOpenedKeys}
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
                    <Link to={subItem.path}>{subItem.label}</Link>
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
                <Link to={item.path}>{item.label}</Link>
              </Menu.Item>
            );
          }
        })}
      </Menu>
    </Sider>
  );
};
