import { Button, Card, Col, Form, PageHeader, Row, Select } from 'antd';
import { useModel } from 'umi';
import ColorPicker from '@/components/ColorPicker';
import { SpacedContainer } from '@/components/SpacedContainer';
import moment from 'moment';

const Option = Select.Option;

const colorPickerOptions = [
  '@primary-color',
  '@secondary-color',
  '@text-color',
  '@text-color-secondary',
  '@heading-color',
  '@layout-header-background',
  '@btn-primary-bg',
];

export default function SiteSettings() {
  const {
    appTheme,
    setAppTheme,
    customColors,
    setCustomColors,
    resetAllThemes,
  } = useModel('theme');

  const handleColorChange = (varname: string, color: string) => {
    varname &&
      setCustomColors({
        ...customColors,
        [varname]: color,
      });
  };

  const getColorPicker = (varName: string) => (
    <Row key={`${varName}-${customColors[varName]}`}>
      <Col span={16} offset={4}>
        <Form.Item
          label={varName}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
        >
          <ColorPicker
            type="sketch"
            color={customColors[varName]}
            position={'bottom'}
            presetColors={[
              '#F5222D',
              '#FA541C',
              '#FA8C16',
              '#FAAD14',
              '#FADB14',
              '#A0D911',
              '#52C41A',
              '#13C2C2',
              '#1890FF',
              '#2F54EB',
              '#722ED1',
              '#EB2F96',
            ]}
            onChangeComplete={(color: string) =>
              handleColorChange(varName, color)
            }
          />
        </Form.Item>
      </Col>
    </Row>
  );
  //   appointmentData:
  //       endDate: Wed Jun 27 2018 00:00:00 GMT+0800 (China Standard Time) {}
  //       id: 34
  //       location: "Room 1"
  //       startDate: Tue Jun 26 2018 00:00:00 GMT+0800 (China Standard Time) {}
  //       title: "Book Flights to San Fran for Sales Trip"

  const colorPickers = colorPickerOptions.map((varName) =>
    getColorPicker(varName),
  );
  return (
    <>
      <PageHeader ghost={false} title="Site Settings" />
      <SpacedContainer>
        <Card>
          <Row>
            <Col span={16} offset={4}>
              <Form.Item
                label="Choose Theme"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 8 }}
              >
                <Select
                  placeholder="Please select theme"
                  value={appTheme}
                  onSelect={setAppTheme}
                >
                  <Option value="light">Light</Option>
                  <Option value="dark">Dark</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          {colorPickers}
          <Row justify="center">
            <Button type="primary" onClick={resetAllThemes} title="Reset Theme">
              Reset Theme
            </Button>
          </Row>
        </Card>
      </SpacedContainer>
    </>
  );
}
