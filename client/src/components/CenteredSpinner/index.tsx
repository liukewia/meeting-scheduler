import React from 'react';
import { Spin } from 'antd';
import { SpinProps } from 'antd/lib/spin';

const CenteredSpinner = (props: SpinProps) => (
  <div style={{ paddingTop: 100, textAlign: 'center' }}>
    <Spin {...props} />
  </div>
);

export default CenteredSpinner;
