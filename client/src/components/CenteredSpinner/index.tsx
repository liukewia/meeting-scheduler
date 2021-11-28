import React from 'react';
import { Spin } from 'antd';
import type { SpinIndicator, SpinSize } from 'antd/lib/spin';

// https://github.com/ant-design/pro-components/issues/2742#issuecomment-844751024
const CenteredSpinner = ({
  indicator,
  size,
  spinning,
  tip,
}: {
  indicator?: SpinIndicator;
  size?: SpinSize;
  spinning?: boolean;
  tip?: string;
}) => {
  const spinProps = { indicator, size, spinning, tip };
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Spin {...spinProps} size="large" />
    </div>
  );
};

export default CenteredSpinner;
