import { Suspense } from 'react';
import { Layout } from 'antd';
import { useModel } from 'umi';

import classNames from 'classnames';
import { PREFIX_CLS } from '@/constants';
import CenteredSpinner from '@/components/CenteredSpinner';
// import 'antd/dist/antd.css';
import './index.less';
import Sider from './Sider';

const { Header, Content } = Layout;

export default (props) => {
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
        />
        <Content>
          <Suspense fallback={<CenteredSpinner tip="loading" />}>
            {props.children}
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
};
