import { LOGIN_PATH, UN_AUTH_PATHS } from '@/constants';
import { getJwt } from '@/utils/jwtUtil';
import { message, notification } from 'antd';
import axios from 'axios';
import { matchPath, history } from 'umi';

const request = createAxiosInstance();

function createAxiosInstance() {
  const instance = axios.create({
    baseURL: 'http://localhost:8081/api',
    timeout: 30000,
    // withCredentials: true,
    // headers: { 'Content-Type': 'application/json' },
  });
  instance.interceptors.request.use((config) => {
    console.log('config: ', config);
    console.log('history.location.pathname: ', history.location.pathname);
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
      console.log('in axios success cb');
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
      console.log('in axios error cb');
      // cannot get response from backend
      console.log(JSON.stringify(error));
      console.log(JSON.stringify(error.response));
      const { response } = error;
      notification.error({
        // expose the potential error explicitly
        message: `${response?.config?.method || error.config?.method} ${
          response?.config?.url || error.config?.url
        } Failed.`,
        description: response?.data?.msg || error.message,
      });
      // the rejected error returned tells userequest to go into onEror callback
      return Promise.reject(error);
    },
  );

  return instance;
}

export default request;
