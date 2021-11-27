export const PREFIX_CLS = 'ant';
export const LOGIN_PATH = '/user/login';
export const SIGN_UP_PATH = '/user/signup';

export const UN_AUTH_PATHS = ['/user/login', '/user/signup'];

export const UN_AUTH_API_PATHS = ['/api/user/login', '/api/user/signup'];

export enum SessionStorageItems {
  SiderSelectedKey = 'sider-selected-keys',
  SiderOpenedKeys = 'sider-opened-keys',
}

// only one sider key can be selected at one time
export enum SiderSelectedKey {
  Home = 'home',
  TimeTable = 'timetable',
  NewMeeting = 'newmeeting',
  SiteSettings = 'settings-site',
  EtcSettings = 'settings-etc',
}

// multiple submenu keys can be opened at a time
export enum SiderOpenedKey {
  Settings = 'settings',
}

export const businessTitle = 'Scheduler';

export const ONE_MINUTE_MILLIS = 60 * 1000;
export const ONE_HOUR_MILLIS = 60 * ONE_MINUTE_MILLIS;
export const ONE_DAY_MILLIS = 24 * ONE_HOUR_MILLIS;
export const ONE_WEEK_MILLIS = 7 * ONE_DAY_MILLIS;
