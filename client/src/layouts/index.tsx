import { IRouteComponentProps } from 'umi';
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import { useEffect, useMemo } from 'react';
import Home from '@/pages/Home';
import { history, useModel } from 'umi';
import { LOGIN_PATH, SIGN_UP_PATH, UN_AUTH_PATHS } from '@/constants';
import { stringify } from 'use-json-comparison';

const LayoutWrapper = (props: IRouteComponentProps) => {
  const { children, location, route, history, match } = props;
  console.log('enter wrapper');
  // check if the user logged in
  const { initialState } = useModel('@@initialState');
  console.log('initialState: ', initialState);
  // useEffect(() => {
  //   const onPageChange = () => {
  //     // if have not logged in, redirect to login page
  //     if (!initialState?.currentUser || UN_AUTH_PATHS[location.pathname]) {
  //       history.push(LOGIN_PATH);
  //     }
  //   };

  //   onPageChange();
  // }, [stringify(location)]);

  // if there is no info in initalstate, do not render in the main layout.
  // this includes but is not limited to login & sign up page.
  if (initialState?.currentUser) {
    console.log('wrapped with home');
    return <Home>{props.children}</Home>;
  }
  console.log('no wrapped with home');

  // if there is user info in initialstate, render children in the main layout
  return <>{props.children}</>;
};

const App = (props: IRouteComponentProps) => {
  return (
    <ConfigProvider locale={enUS}>
      <LayoutWrapper {...props} />
    </ConfigProvider>
  );
};

export default App;
