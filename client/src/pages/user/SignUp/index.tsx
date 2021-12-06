import { useState } from 'react';
import { Form, Button, Input, Popover, Progress, message, Select } from 'antd';
import { Link, history } from 'umi';
import { useRequest } from 'ahooks';
import { signup } from '@/services/user';
import { getZoneOffsetList } from '@/services/zoneOffset';
import { utcOffsetToTxt } from '@/utils/timeUtil';
import './index.less';

const FormItem = Form.Item;

const passwordStatusMap = {
  ok: (
    <div className="success">
      <span>Strength: good</span>
    </div>
  ),
  pass: (
    <div className="warning">
      <span>Strength: moderate</span>
    </div>
  ),
  poor: (
    <div className="error">
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

const SignUpForm: React.FC = (props) => {
  const [visible, setVisible] = useState<Boolean>(false);
  const [popover, setPopover] = useState<Boolean>(false);
  const confirmDirty = false;
  const [form] = Form.useForm();

  const { data, loading: getListLoading } = useRequest(getZoneOffsetList, {
    onError: () => {
      message.error('Cannot get zone id list, please contact adminstrator.');
    },
  });

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
    manual: true,
    onSuccess: () => {
      message.success('Sign up succeed, please log in.');
      history.push('/user/login');
    },
    onError: () => {
      message.error('Sign up failed.');
    },
  });

  const onFinish = (values: any) => {
    runRegister({
      username: values.username,
      zoneId: values.zoneId,
      email: values.email,
      password: values.password,
    });
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
      form.validateFields(['confirmPwd']);
    }
    return promise.resolve();
  };

  const renderPasswordProgress = () => {
    const value = form.getFieldValue('password');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <div className={`progress-${passwordStatus}`}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className="progress"
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  return (
    <div className="signup-container">
      <div className="signup-main">
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
            name="zoneId"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              size="large"
              placeholder="Zone ID"
              showSearch
              loading={getListLoading}
            >
              {data?.zoneOffsetList && Array.isArray(data.zoneOffsetList)
                ? data.zoneOffsetList.map(
                    (item: { zoneId: string; currentUtcOffset: number }) => (
                      <Select.Option key={item.zoneId} value={item.zoneId}>
                        ({utcOffsetToTxt(item.currentUtcOffset)}
                        )&nbsp;&nbsp;&nbsp;{item.zoneId}
                      </Select.Option>
                    ),
                  )
                : null}
            </Select>
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
                'password'
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
            name="confirmPwd"
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
          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className="submit"
              type="primary"
              htmlType="submit"
            >
              <span>Sign up</span>
            </Button>
            <Link className="login" to="/user/login">
              <span>Login with existing account</span>
            </Link>
          </FormItem>
        </Form>
      </div>
    </div>
  );
};
export default SignUpForm;
