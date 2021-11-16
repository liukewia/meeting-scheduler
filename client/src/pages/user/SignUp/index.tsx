import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Form, Button, Input, Popover, Progress, message } from 'antd';
import { Link, history } from 'umi';

import styles from './style.less';
import { useRequest } from 'ahooks';
import { signup } from '@/services/user';

const FormItem = Form.Item;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <span>Strength: good</span>
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <span>Strength: moderate</span>
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <span>Strength: poor</span>
    </div>
  ),
};

const passwordProgressMap: {
  ok: 'success';
  pass: 'normal';
  poor: 'exception';
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

const Register: FC = (props) => {
  // const [count, setCount]: [number, any] = useState(0);
  const [visible, setVisible]: [boolean, any] = useState(false);
  // const [prefix, setPrefix]: [string, any] = useState('86');
  const [popover, setPopover]: [boolean, any] = useState(false);
  const confirmDirty = false;
  let interval: number | undefined;
  const [form] = Form.useForm();

  useEffect(
    () => () => {
      clearInterval(interval);
    },
    [interval],
  );

  const getPasswordStatus = () => {
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  const { loading: submitting, run: runRegister } = useRequest(signup, {
    // defaultParams: [values],
    manual: true,
    onSuccess: (data, [body, params]) => {
      console.log('data: ', data);
      // if (data.status === 'ok') {
      //   message.success('Successfully signed up!');
      //   history.push('/user/login');
      // }
      // if (data.status === 'error') {
      //   message.error('Cannot sign up!');
      // }
    },
  });

  const onFinish = (values: any) => {
    runRegister(values);
  };

  const checkConfirm = (_: any, value: string) => {
    const promise = Promise;
    if (value && value !== form.getFieldValue('password')) {
      return promise.reject('The two passwords do not match!');
    }
    return promise.resolve();
  };

  const checkPassword = (_: any, value: string) => {
    const promise = Promise;
    // 没有值的情况
    if (!value) {
      setVisible(!!value);
      return promise.reject('Please enter password!');
    }
    // 有值的情况
    if (!visible) {
      setVisible(!!value);
    }
    setPopover(!popover);
    if (value.length < 6) {
      return promise.reject('');
    }
    if (value && confirmDirty) {
      form.validateFields(['confirm']);
    }
    return promise.resolve();
  };

  // const changePrefix = (value: string) => {
  //   setPrefix(value);
  // };

  const renderPasswordProgress = () => {
    const value = form.getFieldValue('password');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <h1>Sign Up</h1>
        <Form form={form} name="UserRegister" onFinish={onFinish}>
          <FormItem
            name="username"
            rules={[
              {
                required: true,
              },
              {
                type: 'string',
                message: 'Wrong username format!',
              },
            ]}
          >
            <Input size="large" placeholder="Username" />
          </FormItem>
          <FormItem
            name="email"
            rules={[
              {
                type: 'email',
                message: 'Wrong email format!',
              },
            ]}
          >
            <Input size="large" placeholder="Email" />
          </FormItem>
          <Popover
            getPopupContainer={(node) => {
              if (node && node.parentNode) {
                return node.parentNode as HTMLElement;
              }
              return node;
            }}
            content={
              visible && (
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[getPasswordStatus()]}
                  {renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    <span>Please enter no less than 6 characters.</span>
                  </div>
                </div>
              )
            }
            overlayStyle={{ width: 240 }}
            placement="right"
            visible={visible}
          >
            <FormItem
              name="password"
              className={
                form.getFieldValue('password') &&
                form.getFieldValue('password').length > 0 &&
                styles.password
              }
              rules={[
                {
                  validator: checkPassword,
                },
              ]}
            >
              <Input size="large" type="password" placeholder="Password" />
            </FormItem>
          </Popover>
          <FormItem
            name="confirm"
            rules={[
              {
                required: true,
                message: 'Please confirm password!',
              },
              {
                validator: checkConfirm,
              },
            ]}
          >
            <Input
              size="large"
              type="password"
              placeholder="Confirm password"
            />
          </FormItem>
          {/* <InputGroup compact>
          <Select size="large" value={prefix} onChange={changePrefix} style={{ width: '20%' }}>
            <Option value="86">+86</Option>
            <Option value="87">+87</Option>
          </Select>
          <FormItem
            style={{ width: '80%' }}
            name="mobile"
            rules={[
              {
                required: true,
                message: '请输入手机号!',
              },
              {
                pattern: /^\d{11}$/,
                message: '手机号格式错误!',
              },
            ]}
          >
            <Input size="large" placeholder="手机号" />
          </FormItem>
        </InputGroup>
        <Row gutter={8}>
          <Col span={16}>
            <FormItem
              name="captcha"
              rules={[
                {
                  required: true,
                  message: '请输入验证码!',
                },
              ]}
            >
              <Input size="large" placeholder="验证码" />
            </FormItem>
          </Col>
          <Col span={8}>
            <Button
              size="large"
              disabled={!!count}
              className={styles.getCaptcha}
              onClick={onGetCaptcha}
            >
              {count ? `${count} s` : '获取验证码'}
            </Button>
          </Col>
        </Row> */}
          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              <span>Sign up</span>
            </Button>
            <Link className={styles.login} to="/user/login">
              <span>Login with existing account</span>
            </Link>
          </FormItem>
        </Form>
      </div>
    </div>
  );
};
export default Register;
