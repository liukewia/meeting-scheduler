import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Space, message, Tabs, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, history, useModel } from 'umi';
import { login, queryCurrentUser } from '@/services/user';
import logoSrc from 'public/logo.svg';
import './index.less';
import { businessTitle } from '@/constants';
import { Input, Button, Checkbox } from 'antd';
import Background from '@/components/Background';
import { useRequest } from 'ahooks';
import Omit from 'omit.js';
import { getJwt } from '@/utils/jwtUtil';

const Login: React.FC = (props) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  // on success, store the jwt according to autoLogin, and jump to redirected url or home
  const { loading, run: runLogin } = useRequest(login, {
    throttleWait: 1000,
    manual: true,
    onSuccess: async (userInfo, params) => {
      console.log('params: ', params);
      if (userInfo) {
        await setInitialState((s) => ({ ...s, currentUser: userInfo }));
      }
      console.log('userInfo: ', userInfo);
      if (!history) return;
      const { query } = history.location;
      const { redirect } = query as {
        redirect: string;
      };
      history.push(redirect || '/');
      return;
    },
  });

  // go to the redirect url if already logged in
  useEffect(() => {
    if (
      initialState?.currentUser?.access &&
      initialState?.currentUser?.access !== 'guest'
    ) {
      message.info('You have already logged in.');
      history.push((history?.location?.query?.redirect as string) || '/');
    }
  }, []);

  const onFinish = (values: any) => {
    runLogin(values);
  };

  return (
    <div className="login-container">
      {/* <Background /> */}

      <div className="login-content">
        <div className="login-top">
          <div className="login-header">
            <img src={logoSrc} className="login-logo" alt="scheduler logo" />
            <span className="login-title">{businessTitle}</span>
          </div>
        </div>

        <div className="login-main">
          <Form
            name="normal_login"
            className="login-form"
            onFinish={onFinish}
            initialValues={{
              username: 'finn',
              password: '111111',
              autoLogin: true,
            }}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: 'Please input your Username!' },
              ]}
            >
              <Input
                size="large"
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your Password!' },
              ]}
            >
              <Input
                size="large"
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="autoLogin" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link to="/user/signup">
                <span className="login-form-signup">Sign up</span>
              </Link>
            </Form.Item>
            <Form.Item>
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={loading}
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
