import {
  Card,
  Steps,
  PageHeader,
  Row,
  Col,
  Divider,
  Form,
  Typography,
  Radio,
  InputNumber,
  Space,
  Button,
} from 'antd';
import { useModel } from 'umi';
import { SpacedContainer } from '@/components/SpacedContainer';
import { ONE_HOUR_MILLIS } from '@/constants';
import { getCurrentTimePart } from '@/utils/timeUtil';
import { useMemo, useState } from 'react';
import UserSelector from '@/components/UserSelector';
import MultipleDatePicker from '@/components/MultipleDatePicker';

// 1 -> new meeting form
// 2 -> new meeting result
// need admin priviledge

const stepBarLayout = {
  xs: {
    span: 24,
    offset: 0,
  },
  sm: {
    span: 24,
    offset: 0,
  },
  lg: {
    span: 12,
    offset: 6,
  },
  xl: {
    span: 12,
    offset: 6,
  },
  xxl: {
    span: 12,
    offset: 6,
  },
};

type NewMeetingSteps = 0 | 1;

export const formLayout = {
  labelCol: { span: 9 },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 10 },
    md: { span: 9 },
    lg: { span: 8 },
    xl: { span: 7 },
    xxl: { span: 6 },
  },
};
const buttonLayout = {
  wrapperCol: {
    offset: 9,
    span: 15,
  },
};

export function titleWithOffset(title: string) {
  const colLayout = {
    xs: {
      span: 12,
      offset: 0,
    },
    lg: {
      span: 6,
      offset: 6,
    },
  };

  return (
    <Row>
      <Col {...colLayout}>
        <Typography.Title level={5}>{title}</Typography.Title>
      </Col>
    </Row>
  );
}

export enum ParticipantSourceType {
  Internal,
  External,
}

const initialFormValues = {
  participantSource: ParticipantSourceType.Internal,
  participantList: [],
  spreadsheets: [],
  dates: [],
  duration: 1,
};

const NewMeetingForm = ({ setCurrentStep }) => {
  const [form] = Form.useForm();

  const handleUsersChange = (users: string[]) => {
    form.setFieldsValue({ participantList: users });
  };

  const handleDatesChange = (dates: string[]) => {
    form.setFieldsValue({ dates });
  };

  const getParticipantSourceComponent = (
    radioValue: ParticipantSourceType | undefined,
  ) => {
    switch (radioValue) {
      case ParticipantSourceType.Internal:
        return (
          <Form.Item
            name="participantList"
            label="Participant list"
            rules={[
              {
                required:
                  form.getFieldValue('participantSource') ===
                  ParticipantSourceType.Internal,
              },
            ]}
          >
            <UserSelector onChange={handleUsersChange} />
          </Form.Item>
        );
      case ParticipantSourceType.External:
        return (
          <Form.Item
            label="Spreadsheets"
            name="spreadsheets"
            rules={[
              {
                required:
                  form.getFieldValue('participantSource') ===
                  ParticipantSourceType.External,
              },
            ]}
          >
            <div>spreadsheets</div>
          </Form.Item>
        );
      default:
        return null;
    }
  };

  const onReset = () => {
    // Not to clear the form, but to reset to the value of the initialValues property of the form component
    form.resetFields();
  };

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    // runLogin(values);
  };

  return (
    <Form
      {...formLayout}
      form={form}
      name="New meeting form"
      onFinish={onFinish}
      initialValues={initialFormValues}
    >
      {titleWithOffset('Participants')}
      <Form.Item
        name="participantSource"
        label="Participant source"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          options={[
            {
              label: 'Database',
              value: ParticipantSourceType.Internal,
            },
            {
              label: 'Import from spreadsheets',
              value: ParticipantSourceType.External,
            },
          ]}
        />
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prev, curr) =>
          prev.participantSource !== curr.participantSource
        }
      >
        {() =>
          getParticipantSourceComponent(form.getFieldValue('participantSource'))
        }
      </Form.Item>
      {titleWithOffset('Meeting info')}
      <Form.Item
        name="dates"
        label="Dates (in UTC 0)"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <MultipleDatePicker onChange={handleDatesChange} />
      </Form.Item>
      <Form.Item
        name="duration"
        label="Expected duration"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <InputNumber
          addonAfter="hours"
          min={0.1}
          max={12}
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item {...buttonLayout}>
        <Space size="large">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button onClick={onReset}> 重置 </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

const FormResult = () => {
  return <div>FormResult</div>;
};

export default () => {
  const [currentStep, setCurrentStep] = useState<NewMeetingSteps>(0);

  const currComponent = useMemo(() => {
    const getCurrentStepAndComponent = (currStep = 1) => {
      const stepAndComponent: { [key: string]: React.ReactElement } = {
        0: (
          <NewMeetingForm
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        ),
        1: (
          <FormResult
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        ),
      };
      return stepAndComponent[currStep];
    };

    return getCurrentStepAndComponent(currentStep);
  }, [currentStep]);

  return (
    <>
      <PageHeader ghost={false} title="New meeting"></PageHeader>
      <SpacedContainer>
        <Card>
          <Row>
            <Col {...stepBarLayout}>
              <Steps current={currentStep}>
                <Steps.Step title="Fill in info" />
                <Steps.Step title="Result" />
              </Steps>
            </Col>
          </Row>
          <Divider />
          {currComponent}
        </Card>
      </SpacedContainer>
    </>
  );
};
