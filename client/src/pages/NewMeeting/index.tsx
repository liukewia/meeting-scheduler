import { useEffect, useMemo, useState } from 'react';
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
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { useRequest } from 'ahooks';
import { SpacedContainer } from '@/components/SpacedContainer';
import { planMeeting, sheetUpload } from '@/services/meeting';
import UserSelector from '@/components/UserSelector';
import MultipleDatePicker from '@/components/MultipleDatePicker';
import {
  MYSQL_MIN_TIMESTAMP,
  MYSQL_MAX_TIMESTAMP,
  SPREADSHEET_EXTS,
} from '@/constants';

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

  const handleSheetsChange = (info: UploadChangeParam<UploadFile<any>>) => {
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

  const onReset = () => {
    // Not to clear the form, but to reset to the value of the initialValues property of the form component
    form.resetFields();
  };

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);

    let reqBody;
    const source = values.participantSource;
    if (source === ParticipantSourceType.Internal) {
      const people = values.participantList;
      if (!Array.isArray(people) || people.length <= 2) {
        message.error('Please select at least 2 people.');
        return;
      }
      reqBody = {
        participantSource: source,
        participantList: people,
        dates: values.dates,
        duration: values.duration, // in minutes
      };
    } else if (source === ParticipantSourceType.External) {
      const sheets = values.spreadsheets;
      if (!Array.isArray(sheets) || sheets.length <= 2) {
        message.error('Please upload at least 2 valid spreadsheets');
        return;
      }
      const validSheets = [];
      for (let i = 0; i < sheets.length; i++) {
        if (sheets[i].error || !sheets[i].response?.filePath) {
          message.error(`The ${i + 1}th spreadsheet in the list has error.`);
          return;
        } else {
          validSheets.push(sheets[i]);
        }
      }
      reqBody = {
        participantSource: source,
        spreadsheets: validSheets.map((file: SheetFile) => ({
          uid: file.uid,
          name: file.name,
          path: file.response.filePath,
        })),
        dates: values.dates,
        duration: values.duration, // in minutes
      };
    } else {
      console.error('Unknown participant source.');
      return;
    }
    console.log(`reqBody: `, reqBody);
    runPlanMeeting(reqBody);
    setCurrentStep(1);
  };

  // manage side effect manually
  const onSourceRadioChange = (e: {
    target: { value: ParticipantSourceType };
  }) => {
    switch (e.target.value) {
      case ParticipantSourceType.Internal:
        form.setFieldsValue({
          spreadsheets: [],
        });
        break;
      case ParticipantSourceType.External:
        form.setFieldsValue({
          participantList: [],
        });
        break;
      default:
        break;
    }
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
          onChange={onSourceRadioChange}
        />
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prev, curr) =>
          prev.participantSource !== curr.participantSource
        }
      >
        {({ getFieldValue }) => {
          switch (getFieldValue('participantSource')) {
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
                              new Error('Should select at least two people.'),
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
                              new Error(
                                'Should at least upload two valid spreadsheets.',
                              ),
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
        }}
      </Form.Item>
      {titleWithOffset('Meeting Requirements')}
      <Form.Item
        name="dates"
        label="Potential dates" // (in UTC 0)
        rules={[
          {
            required: true,
            validator: (_, value) =>
              Array.isArray(value) &&
              value.every(
                (timestamp) =>
                  timestamp >= MYSQL_MIN_TIMESTAMP &&
                  timestamp <= MYSQL_MAX_TIMESTAMP,
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
