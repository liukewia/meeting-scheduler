import { Redirect, useAccess } from 'umi';
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import MainLayout from '@/pages/MainLayout';



const AuthWrapper = (props) => {
  const { isLoggedIn } = useAccess();
  if (isLoggedIn) {
    return <MainLayout>{props.children}</MainLayout>;
  } else {
    return <Redirect to="/user/login" />;
  }
};


export default (props) => {
  return (
    <ConfigProvider locale={enUS}>
      <AuthWrapper {...props} />
    </ConfigProvider>
  );
};

