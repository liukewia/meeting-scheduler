import { IRouteComponentProps, useModel, matchPath, Redirect } from 'umi';
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import MainLayout from '@/pages/MainLayout';
import { UN_AUTH_PATHS } from '@/constants';

const LayoutWrapper = ({
  children,
  location,
  route,
  history,
  match,
}: IRouteComponentProps) => {
  const pathname = location.pathname;
  const { initialState } = useModel('@@initialState');
  const isUnAuthPaths = matchPath(pathname, {
    path: UN_AUTH_PATHS,
  });
  console.log(1);
  // if is login / signup page, go to them directly.
  if (isUnAuthPaths) {
    return <>{children}</>;
  }
  console.log(12);
  // not un-auth paths, but the user also has not logged in, e.g. an unauth user wants to go to homepage.
  if (!isUnAuthPaths && !initialState?.currentUser?.id) {
    // jump to login page
    return <Redirect to="/user/login" />;
  }
  console.log(14);

  // else, the user has logged in.
  return <MainLayout>{children}</MainLayout>;
};

export default (props: any) => {
  return (
    <ConfigProvider locale={enUS}>
      <LayoutWrapper {...props} />
    </ConfigProvider>
  );
};
