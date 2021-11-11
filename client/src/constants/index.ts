const PREFIX_CLS = 'ant';
const LOGIN_PATH = '/user/login';
const SIGN_UP_PATH = 'user/signup';

const UN_AUTH_PATHS: { [key: string]: true } = {
  [LOGIN_PATH]: true,
  [SIGN_UP_PATH]: true,
};

export { PREFIX_CLS, LOGIN_PATH, SIGN_UP_PATH, UN_AUTH_PATHS };
