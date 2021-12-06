import { history, matchPath } from 'umi';
import { queryCurrentUser } from '@/services/user';
import { LOGIN_PATH, UN_AUTH_PATHS } from '@/constants';
import { getJwt } from './utils/jwtUtil';

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
      const res = await queryCurrentUser();
      return res;
    } catch (error) {
      console.error('fetchUserInfo error: ', error);
      history.push(LOGIN_PATH);
    }
    return undefined;
  };

  // https://v5.reactrouter.com/web/api/matchPath
  const isInUnauthRoutes = matchPath(history.location.pathname, {
    path: UN_AUTH_PATHS,
  });
  if (isInUnauthRoutes && getJwt()) {
    // has jwt, need auto login now
    const currentUser = await fetchUserInfo();
    // prevent jumping when id is 0
    if (currentUser?.id === undefined) {
      history.push('/');
    }
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }
  if (!isInUnauthRoutes) {
    const currentUser = await fetchUserInfo();
    if (currentUser?.id === undefined) {
      history.push(LOGIN_PATH);
    }
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    settings: {},
  };
}
