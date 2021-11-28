import { Suspense } from 'react';
import { Layout, Space } from 'antd';
import { useModel } from 'umi';
import classNames from 'classnames';
import CenteredSpinner from '@/components/CenteredSpinner';
import Sider from './Sider';
import AvatarDropdown from '@/components/AvatarDropdown';
import { PREFIX_CLS } from '@/constants';
import './index.less';

const { Header, Content } = Layout;

export default (props: any) => {
  // control the currently selected key to memoize selected sider item after a jump.
  const { isLightTheme } = useModel('theme', (model) => ({
    isLightTheme: model.isLightTheme,
  }));

  const siderPrefixCls = `${PREFIX_CLS}-layout-sider`;

  return (
    <Layout style={{ overflow: 'hidden', height: '100vh' }}>
      <Sider siderPrefixCls={siderPrefixCls} />

      <Layout style={{ overflowY: 'scroll' }}>
        <Header
          className={classNames({
            [`${PREFIX_CLS}-layout-header`]: true,
            [`${PREFIX_CLS}-layout-header-light`]: isLightTheme,
          })}
        >
          <Space className="header-right">
            <AvatarDropdown />
          </Space>
        </Header>
        <Content>
          <Suspense fallback={<CenteredSpinner tip="loading" />}>
            {props.children}
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
};
