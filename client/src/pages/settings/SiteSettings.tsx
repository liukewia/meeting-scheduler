import { Button, Col, Form, Row, Select } from 'antd';
import { useModel } from '@/.umi/plugin-model/useModel';
import ColorPicker from '@/components/ColorPicker';
import { useCallback, useMemo } from 'react';

const Option = Select.Option;

const themeLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

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
  const { appTheme, setAppTheme, getAppColors, setAppColors, resetAllThemes } =
    useModel('theme');

  const handleColorChange = (varname: string, color: string) => {
    debugger;
    const vars = getAppColors();
    if (varname) vars[varname] = color;
    setAppColors(vars);
  };

  const getColorPicker = useCallback(
    (varName, position) => {
      const colors = getAppColors();
      return (
        <Row className="color-row" key={`${varName}-${colors[varName]}`}>
          <Col xs={4} className="color-palette">
            <ColorPicker
              type="sketch"
              small
              color={colors[varName]}
              position={position || 'right'}
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
              onChangeComplete={(color) => handleColorChange(varName, color)}
            />
          </Col>
          <Col className="color-name" xs={20}>
            {varName}
          </Col>
        </Row>
      );
    },
    [getAppColors()],
  );

  const colorPickers = useMemo(
    () =>
      colorPickerOptions.map((varName, index) =>
        getColorPicker(varName, index > 3 ? 'top' : 'right'),
      ),
    [appTheme],
  );

  return (
    <>
      <Row className="theme-selector-dropdown">
        <Col span={22} offset={1}>
          <Form.Item
            {...themeLayout}
            label="Choose Theme"
            className="ant-col ant-col-xs-22 ant-col-offset-1 choose-theme"
          >
            <Select
              placeholder="Please select theme"
              value={appTheme}
              onSelect={(val) => {
                console.log('new serelcted theme in select: ', val);
                setAppTheme(val);
              }}
            >
              <Option value="light">Light</Option>
              <Option value="dark">Dark</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      {colorPickers}
      <Row type="flex" justify="center">
        <Button type="primary" onClick={resetAllThemes} title="Reset Theme">
          Reset Theme
        </Button>
      </Row>
    </>
  );
}
