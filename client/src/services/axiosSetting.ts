import { message, notification } from 'antd';
import axios from 'axios';
import { matchPath } from 'umi';
import { API_URL, LOGIN_PATH, UN_AUTH_PATHS } from '@/constants';
import { getJwt } from '@/utils/jwtUtil';
import { isDev } from '@/utils/nodeUtil';

function createAxiosInstance() {
  const instance = axios.create({
    baseURL: API_URL,
    timeout: 30000,
    // withCredentials: true,
    // headers: { 'Content-Type': 'application/json' },
  });
  instance.interceptors.request.use((config) => {
    const jwt = getJwt();
    if (
      !matchPath(config.url || '', {
        path: UN_AUTH_PATHS,
      }) &&
      jwt &&
      config &&
      config.headers
    ) {
      config.headers.Authorization = jwt;
    }
    return config;
  });
  instance.interceptors.response.use(
    (axiosRes) => {
      const { data: res } = axiosRes;
      // request succeeded, but may have business logic error
      const requestSucceed = /^(2|3)\d{2}$/; // Code starting with 2 or 3 is regarded as a successful request
      // store jwt into localstorage
      if (requestSucceed.test('' + res.code)) {
        const jwt = axiosRes.headers?.authorization;
        if (
          matchPath(axiosRes.config.url || '', {
            path: LOGIN_PATH,
          }) &&
          jwt
        ) {
          const autoLogin = JSON.parse(axiosRes.config.data)['autoLogin'];
          if (autoLogin !== undefined) {
            if (autoLogin) {
              localStorage.setItem('jwt', jwt);
            } else {
              sessionStorage.setItem('jwt', jwt);
            }
          }
        }
        return res.data;
      }
      // Determine the failed code code and make prompts and other operations
      if (axiosRes.status === 401) {
        message.error(res.msg);
      } else {
        message.warning(res.msg);
      }
      return Promise.reject(res);
    },
    (error) => {
      // cannot get response from backend
      isDev &&
        notification.error({
          // expose the potential error explicitly
          message: `${error.response?.config?.method || error.config?.method} ${
            error.response?.config?.url || error.config?.url
          } Failed.`,
          description: error.response?.data?.msg || error.message,
        });
      // the rejected error returned will be caught by useRequest and goes into onError callback
      return Promise.reject(error);
    },
  );

  return instance;
}

const request = createAxiosInstance();

export default request;
