import { useState, Suspense } from 'react';
import { Layout, PageHeader, Space } from 'antd';
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
    <Layout>
      <Sider siderPrefixCls={siderPrefixCls} />

      <Layout>
        <Header
          className={classNames({
            [`${PREFIX_CLS}-layout-header`]: true,
            [`${PREFIX_CLS}-layout-header-shadow`]: isLightTheme,
          })}
        />
        {/* like ct dashboard 封装pagecontainer */}
        <Content style={{ margin: '16px 16px' }}>
          <Suspense fallback={<CenteredSpinner tip="loading" />}>
            {props.children}
            {/* <PageHeader ghost={false} title="活动列表" />
            <Space direction="vertical" size="middle">
              {props.children}
            </Space> */}
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
};
