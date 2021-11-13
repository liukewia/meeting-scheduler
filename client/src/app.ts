import { history, matchPath } from 'umi';
import { queryCurrentUser } from '@/services/user';
import { LOGIN_PATH, UN_AUTH_PATHS } from '@/constants';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: any;
  currentUser?: any;
  fetchUserInfo?: () => Promise<any>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      console.error('fetchUserInfo error: ', error);
      history.push(LOGIN_PATH);
    }
    return undefined;
  };

  // https://v5.reactrouter.com/web/api/matchPath
  if (
    !matchPath(history.location.pathname, {
      path: UN_AUTH_PATHS,
    })
  ) {
    const currentUser = await fetchUserInfo();
    console.log('initialState: ', {
      fetchUserInfo,
      currentUser,
      settings: {},
    });
    if (currentUser?.id === undefined) {
      history.push(LOGIN_PATH);
    }
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }
  console.log('initialState: ', {
    fetchUserInfo,
    settings: {},
  });

  return {
    fetchUserInfo,
    settings: {},
  };
}

/**
 *
 * @params routes, matchedRoutes, location, action
 * // https://github.com/umijs/umi/blob/5c86b136b551fdc5327536da5ec223c4e936a998/packages/renderer-react/src/renderClient/renderClient.tsx#L50
 *
 */
// export function onRouteChange({ location, routes, action }) {
//   // because here I can not get initial state
//   // if (!localStorage.getItem('sessionid') && location.pathname !== LOGIN_PATH) {
//   //   history.push(LOGIN_PATH);
//   // }
//   // set initial selected keys and opened keys in sider.
//   // pathname -> session -> ui
//   // initSider(location.pathname, siderItems);
// }
