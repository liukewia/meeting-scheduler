import React, { useCallback } from 'react';
import {
  EditOutlined,
  LoginOutlined,
  LogoutOutlined,
  PlusOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Menu, message, Spin } from 'antd';
import { history, matchPath, useModel } from 'umi';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { useAccess } from 'umi';
import { logout } from '@/services/user';
import { useRequest } from 'ahooks';
import './index.less';
import { LOGIN_PATH } from '@/constants';

const loading = (
  <span className="action account">
    <Spin
      size="small"
      style={{
        marginLeft: 8,
        marginRight: 8,
      }}
    />
  </span>
);

const AvatarDropdown: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const access = useAccess();
  const { setAppTheme } = useModel('theme', (model) => ({
    setAppTheme: model.setAppTheme,
  }));
  const { run: runLogout } = useRequest(logout, {
    throttleWait: 1000,
    manual: true,
    onSuccess: async () => {
      localStorage.removeItem('jwt');
      sessionStorage.removeItem('jwt');
      message.success('Successful logout.');
      setInitialState((s) => ({
        ...s,
        currentUser: {
          access: 'guest',
        },
      }));

      const { query = {}, pathname } = history.location;
      const { redirect } = query;
      if (
        !matchPath(history.location.pathname, {
          path: LOGIN_PATH,
        }) &&
        !redirect
      ) {
        setAppTheme('light'); // rollback to default theme, but not colors
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: pathname,
          }),
        });
      }
    },
  });

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      // if (key === 'login') {
      //   if (initialState?.currentUser?.access === 'guest') {
      //     login();
      //   } else {
      //     window.location.reload();
      //   }
      //   return;
      // }
      if (key === 'logout') {
        runLogout();
        return;
      }
      // other than login and logout situations
      history.push(`${key}`);
    },
    [setInitialState],
  );

  if (!initialState) {
    return loading;
  }
  const { currentUser } = initialState;
  if (!currentUser?.access || !access.isLoggedIn) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu
      className="header-dropdown-menu"
      selectedKeys={[]}
      onClick={onMenuClick}
    >
      <Menu.Item key="/account/center">
        <UserOutlined />
        Personal Center
      </Menu.Item>
      <Menu.Item key="/account/settings">
        <SettingOutlined />
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <LogoutOutlined />
        Logout
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className="header-item-action header-account">
        <Avatar
          size="small"
          className="header-avatar"
          src={initialState?.currentUser?.avatar}
          alt="avatar"
        />
        <span className="name anticon">
          {currentUser?.username || 'Anonymous User'}
        </span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
