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
  Upload,
  message,
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { SpacedContainer } from '@/components/SpacedContainer';
import { useMemo, useState } from 'react';
import UserSelector from '@/components/UserSelector';
import MultipleDatePicker from '@/components/MultipleDatePicker';
import { useRequest } from 'ahooks';
import { planMeeting, sheetUpload } from '@/services/meeting';
import { RcFile } from 'antd/lib/upload';
import { MYSQL_DATE_LOWER_LIMIT, MYSQL_DATE_UPPER_LIMIT } from '@/constants';

const { Dragger } = Upload;

export interface IUploadEvent {
  file: RcFile;
  fileList: RcFile[];
}

const normalizeFile = (e: IUploadEvent) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

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
    span: 16,
    offset: 4,
  },
  xl: {
    span: 14,
    offset: 5,
  },
  xxl: {
    span: 12,
    offset: 6,
  },
};

// 0 -> new meeting form
// 1 -> new meeting result

type NewMeetingSteps = 0 | 1;

interface SheetFile extends RcFile {
  response?: any;
  error?: unknown;
}

const formLayout = {
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

function titleWithOffset(title: string) {
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
    <Row style={{ margin: '50px 0px 20px' }}>
      <Col {...colLayout}>
        <Typography.Title level={5}>{title}</Typography.Title>
      </Col>
    </Row>
  );
}

enum ParticipantSourceType {
  Internal, // 0
  External, // 1
}

const initialFormValues = {
  participantSource: ParticipantSourceType.Internal,
  participantList: [],
  spreadsheets: [],
  dates: [],
  duration: 30,
};

const NewMeetingForm = ({ setCurrentStep, runPlanMeeting }) => {
  const [form] = Form.useForm();

  const handleUsersChange = (users: string[]) => {
    form.setFieldsValue({ participantList: users });
  };

  const customRequest = (customRequest: any) => {
    return sheetUpload({ file: customRequest.file })
      .then((res) =>
        res.reason ? customRequest.onError(res) : customRequest.onSuccess(res),
      )
      .catch(customRequest.onError);
  };

  const handleSheetsChange = (info: { file: any; fileList: [] }) => {
    const file = info.file;
    const status = file?.status;
    if (status === 'done') {
      message.success(`${file?.name} file uploaded successfully.`);
    } else if (status === 'error') {
      const error = file.error;
      if (error && error?.reason) {
        message.error(error.reason);
      } else {
        message.error(`${file?.name} file upload failed.`);
      }
    }
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
            label="Participants"
            rules={[
              {
                required:
                  form.getFieldValue('participantSource') ===
                  ParticipantSourceType.Internal,
                validator: (_, value) =>
                  Array.isArray(value) && value.length >= 2
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error('Should select at least two people'),
                      ),
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
            valuePropName="fileList"
            getValueFromEvent={normalizeFile}
            rules={[
              {
                required:
                  form.getFieldValue('participantSource') ===
                  ParticipantSourceType.External,
                validator: (_, value) =>
                  Array.isArray(value) &&
                  value.filter((file) => file.response).length >= 2
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error('Should at least upload two valid sheets'),
                      ),
              },
            ]}
          >
            <Dragger
              // accept={SPREADSHEET_EXTS.map((ext) => '.' + ext).join(',')}
              multiple
              name="spreadsheets"
              onChange={handleSheetsChange}
              customRequest={customRequest}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag files here to upload
              </p>
            </Dragger>
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
    let reqBody;
    if (values.participantSource === ParticipantSourceType.Internal) {
      reqBody = {
        participantSource: values.participantSource,
        participantList: values.participantList,
        dates: values.dates,
        duration: values.duration, // in minutes
      };
    } else if (values.participantSource === ParticipantSourceType.External) {
      reqBody = {
        participantSource: values.participantSource,
        spreadsheets: values.spreadsheets
          .filter((file: SheetFile) => {
            return file.response.filePath && !file.error;
          })
          .map((file: SheetFile) => ({
            uid: file.uid,
            name: file.name,
            path: file.response.filePath,
          })),
        dates: values.dates,
        duration: values.duration, // in minutes
      };
    } else {
      return;
    }
    runPlanMeeting(reqBody);
    setCurrentStep(1);
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
        label="Source"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Radio.Group
          optionType="button"
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
        label="Potential dates" // (in UTC 0)
        rules={[
          {
            required: true,
            validator: (_, value) =>
              Array.isArray(value) &&
              value.every(
                (date) =>
                  date >= MYSQL_DATE_LOWER_LIMIT &&
                  date <= MYSQL_DATE_UPPER_LIMIT,
              )
                ? Promise.resolve()
                : Promise.reject(new Error(`Date out of bound.`)),
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
          addonAfter="minutes"
          min={1}
          max={720}
          step={1}
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item {...buttonLayout} style={{ marginTop: 40 }}>
        <Space size="large">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button onClick={onReset}>Reset</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

const FormResult = ({ setCurrentStep, planResult, planLoading, planError }) => {
  return <div>FormResult</div>;
};

export default () => {
  const [currentStep, setCurrentStep] = useState<NewMeetingSteps>(0);

  const {
    data: planResult,
    loading: planLoading,
    error: planError,
    run: runPlanMeeting,
  } = useRequest(planMeeting, {
    manual: true,
    debounceWait: 100,
    onSuccess: () => {},
    onError: () => {},
  });

  const currComponent = useMemo(() => {
    const getCurrentStepAndComponent = (currStep = 1) => {
      const stepAndComponent: { [key: string]: React.ReactElement } = {
        0: (
          <NewMeetingForm
            // currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            runPlanMeeting={runPlanMeeting}
          />
        ),
        1: (
          <FormResult
            // currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            planResult={planResult}
            planLoading={planLoading}
            planError={planError}
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
