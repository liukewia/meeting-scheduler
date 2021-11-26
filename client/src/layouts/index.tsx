import { IRouteComponentProps, useModel, matchPath, Redirect } from 'umi';
import { ConfigProvider, message } from 'antd';
import en_GB from 'antd/lib/locale/en_US';
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

  // if is login / signup page, go to them directly.
  if (isUnAuthPaths) {
    // the dark theme has not been adapted in unauthed pages, fallback to light theme
    return <>{children}</>;
  }
  // not un-auth paths, but the user also has not logged in, e.g. an unauth user wants to go to homepage.

  if (!isUnAuthPaths && !initialState?.currentUser?.id) {
    console.log('cannot fetch initial state, fallback to login page');
    // jump to login page
    return <Redirect to="/user/login" />;
  }

  // else, the user has logged in.
  return <MainLayout>{children}</MainLayout>;
};

export default (props: any) => {
  return (
    <ConfigProvider locale={en_GB}>
      <LayoutWrapper {...props} />
    </ConfigProvider>
  );
};
