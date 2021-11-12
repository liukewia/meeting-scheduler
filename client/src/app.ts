import { history } from 'umi';
import { queryCurrentUser } from '@/services/user';
import {
  LOGIN_PATH,
  SessionStorageItems,
  SiderOpenedKey,
  SiderSelectedKey,
} from '@/constants';
import {
  initSiderOpenedKeys,
  initSiderSelectedKeys,
} from './utils/model/siderUtils';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: any;
  currentUser?: any;
  fetchUserInfo?: () => Promise<any>;
}> {
  // set initial selected keys and opened keys in sider.
  initSiderSelectedKeys();
  initSiderOpenedKeys();

  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      history.push(LOGIN_PATH);
    }
    return undefined;
  };

  if (history.location.pathname !== LOGIN_PATH) {
    const currentUser = await fetchUserInfo();
    // console.log('initialState: ', {
    //   fetchUserInfo,
    //   currentUser,
    //   settings: {},
    // });
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }
  // console.log('initialState: ', {
  //   fetchUserInfo,
  //   settings: {},
  // });

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
//   const initialState = useModel('@@initialState');
//   if (!initialState?.currentUser && location.pathname !== LOGIN_PATH) {
//     history.push(LOGIN_PATH);
//   }
// }
