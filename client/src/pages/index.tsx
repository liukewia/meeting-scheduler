// import 'antd/dist/antd.css';
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import { useEffect } from 'react';
import Home from '@/pages/Home';
import { history, useModel } from 'umi';
import { LOGIN_PATH, REGISTER_PATH } from '@/constants';
import { stringify } from 'use-json-comparison';
// import '@/../public/color.less';

const IndexPage = () => {

  const initialState = useModel('@@initialState');

  useEffect(() => {
    const onPageChange = () => {
      // 如果没有登录，重定向到 login
      const { location } = history;
      if (
        !initialState?.currentUser &&
        location.pathname !== LOGIN_PATH &&
        location.pathname !== REGISTER_PATH
      ) {
        history.push(LOGIN_PATH);
      }
    };
  }, [stringify(location)]);

  
  return (
    <ConfigProvider locale={enUS}>
      <Home />
    </ConfigProvider>
  );
};

export default IndexPage;
