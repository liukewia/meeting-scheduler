import { UN_AUTH_PATHS } from '@/constants';
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
    const jwt = localStorage.getItem('jwt');
    if (
      !matchPath(history.location.pathname, {
        path: UN_AUTH_PATHS,
      }) &&
      config &&
      config.headers &&
      jwt
    ) {
      config.headers.Authorization = jwt;
    }
    return config;
  });
  instance.interceptors.response.use(
    (axiosRes) => {
      console.log('axiosRes: ', axiosRes);

      console.log('in success cb');
      const { data: res } = axiosRes;
      // request succeeded, but may have business logic error
      const requestSucceed = /^(2|3)\d{2}$/; // Code starting with 2 or 3 is regarded as a successful request
      // store jwt into localstorage
      if (requestSucceed.test(res.code.toString())) {
        const jwt = axiosRes.headers.authorization;
        if (axiosRes.config.url?.includes('user/login') && jwt) {
          if (JSON.parse(axiosRes.config.data)['autoLogin']) {
            localStorage.setItem('jwt', jwt);
          } else {
            sessionStorage.setItem('jwt', jwt);
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
      console.log('in error cb');
      // cannot get response from backend
      // console.log(JSON.stringify(error));
      // console.log(JSON.stringify(error.response));
      notification.error({
        message: `${error?.response?.config?.method} ${error?.response?.config?.url} Failed.`,
        description: error?.response?.data?.msg,
      });
      // return Promise.reject(error);
    },
  );

  return instance;
}

export default request;
