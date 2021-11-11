import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  TwitterCircleFilled,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { Alert, Space, message, Tabs, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, history, useModel } from 'umi';
import { login } from '@/services/user';
import styles from './index.less';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = (props) => {
  const [submitting, setSubmitting] = useState(false);
  const [userLoginState, setUserLoginState] = useState<any>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  // go to the redirect url if already logged in
  useEffect(() => {
    if (
      initialState?.currentUser?.access === 'admin' ||
      initialState?.currentUser?.access === 'user'
    ) {
      message.info('You have already logged in.');
      history.push((history?.location?.query?.redirect as string) || '/');
    }
  }, []);

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();

    if (userInfo) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    setSubmitting(true);

    try {
      const { data: msg } = await login({ ...values });
      if (msg.status === 'ok') {
        message.success('Logged in successfully!');
        await fetchUserInfo();

        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as {
          redirect: string;
        };
        history.push(redirect || '/');
        return;
      }
      setUserLoginState({ ...msg, type: 'account' });
    } catch (error) {
      const defaultLoginFailureMessage = 'Login failed, please check!';
      message.error(defaultLoginFailureMessage);
    }

    setSubmitting(false);
  };

  const { status, type: loginType } = userLoginState;
  return (
    <div>login</div>
    // <div className={styles.container}>
    //   <div className={styles.content}>
    //     <div className={styles.top}>
    //       <div className={styles.header}>
    //         <Link to="/">
    //           <img alt="logo" className={styles.logo} src={`${isDev ? '/' : '/static/'}logo.svg`} />
    //           <span className={styles.title}>{businessTitle}</span>
    //         </Link>
    //       </div>
    //     </div>

    //     <div className={styles.main}>
    //       <Form
    //         initialValues={{
    //           autoLogin: true,
    //         }}
    //         submitter={{
    //           searchConfig: {
    //             submitText: 'Log in',
    //           },
    //           render: (_, dom) => dom.pop(),
    //           submitButtonProps: {
    //             loading: submitting,
    //             size: 'large',
    //             style: {
    //               width: '100%',
    //             },
    //           },
    //         }}
    //         onFinish={async (values) => {
    //           handleSubmit(values as API.LoginParams);
    //         }}
    //       >
    //         <Tabs activeKey={type} onChange={setType}>
    //           <Tabs.TabPane key="account" tab={'Login by account'} />
    //           {/* <Tabs.TabPane key="mobile" tab={'手机号登录'} /> */}
    //         </Tabs>

    //         {status === 'error' && loginType === 'account' && (
    //           <LoginMessage content={'wrong username or password'} />
    //         )}
    //         {type === 'account' && (
    //           <>
    //             <ProFormText
    //               name="username"
    //               fieldProps={{
    //                 size: 'large',
    //                 prefix: <UserOutlined className={styles.prefixIcon} />,
    //               }}
    //               placeholder={'username (for demo, enter \'emily\')'}
    //               rules={[
    //                 {
    //                   required: true,
    //                   message: 'Username required!',
    //                 },
    //               ]}
    //             />
    //             <ProFormText.Password
    //               name="password"
    //               fieldProps={{
    //                 size: 'large',
    //                 prefix: <LockOutlined className={styles.prefixIcon} />,
    //               }}
    //               placeholder={'password (for demo, enter \'abcd3\')'}
    //               rules={[
    //                 {
    //                   required: true,
    //                   message: 'Password required!',
    //                 },
    //               ]}
    //             />
    //           </>
    //         )}

    //         {/* {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误" />} */}
    //         {/* {type === 'mobile' && (
    //           <>
    //             <ProFormText
    //               fieldProps={{
    //                 size: 'large',
    //                 prefix: <MobileOutlined className={styles.prefixIcon} />,
    //               }}
    //               name="mobile"
    //               placeholder={'请输入手机号！'}
    //               rules={[
    //                 {
    //                   required: true,
    //                   message: '手机号是必填项！',
    //                 },
    //                 {
    //                   pattern: /^1\d{10}$/,
    //                   message: '不合法的手机号！',
    //                 },
    //               ]}
    //             />
    //             <ProFormCaptcha
    //               fieldProps={{
    //                 size: 'large',
    //                 prefix: <LockOutlined className={styles.prefixIcon} />,
    //               }}
    //               captchaProps={{
    //                 size: 'large',
    //               }}
    //               placeholder={'请输入验证码！'}
    //               captchaTextRender={(timing, count) => {
    //                 if (timing) {
    //                   return `${count} ${'秒后重新获取'}`;
    //                 }

    //                 return '获取验证码';
    //               }}
    //               name="captcha"
    //               rules={[
    //                 {
    //                   required: true,
    //                   message: '验证码是必填项！',
    //                 },
    //               ]}
    //               onGetCaptcha={async (phone) => {
    //                 const result = await getFakeCaptcha({
    //                   phone,
    //                 });

    //                 if (result === false) {
    //                   return;
    //                 }

    //                 message.success('获取验证码成功！验证码为：1234');
    //               }}
    //             />
    //           </>
    //         )} */}
    //         <div
    //           style={{
    //             marginBottom: 24,
    //           }}
    //         >
    //           {/* <ProFormCheckbox noStyle name="autoLogin">
    //             auto login
    //           </ProFormCheckbox> */}
    //           <Link
    //             to="/"
    //             onClick={() =>
    //               setInitialState((s) => ({
    //                 ...s,
    //                 currentUser: {
    //                   access: 'guest',
    //                   state: 'error',
    //                 },
    //               }))
    //             }
    //           >
    //             Visit as guest
    //           </Link>
    //           <Link
    //             to="/user/signup"
    //             style={{
    //               float: 'right',
    //             }}
    //           >
    //             Signup
    //           </Link>
    //         </div>
    //       </Form>
    //       {/* <Space className={styles.other}>
    //         Other login methods:
    //         <TwitterCircleFilled className={styles.icon} />
    //         <AlipayCircleOutlined className={styles.icon} />
    //         <TaobaoCircleOutlined className={styles.icon} />
    //         <WeiboCircleOutlined className={styles.icon} />
    //       </Space> */}
    //     </div>
    //   </div>
    // </div>
  );
};

export default Login;
