import { Space } from 'antd';
import { FC } from 'react';
import styles from './index.less';

export const SpacedContainer: FC<{}> = (props) => {
  const { children, ...properties } = props;
  return (
    <Space
      direction="vertical"
      size="middle"
      className={styles['spaced-container']}
      {...properties}
    >
      {children}
    </Space>
  );
};
