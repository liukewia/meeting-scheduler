import { isDev } from '@/utils/nodeUtil';

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

export const SPREADSHEET_EXTS = ['xls', 'xlsx'];

// https://dev.mysql.com/doc/refman/8.0/en/datetime.html
// The TIMESTAMP data type is used for values that contain both date and time parts. TIMESTAMP has a range of '1970-01-01 00:00:01' UTC to '2038-01-19 03:14:07' UTC.
export const MYSQL_MIN_TIMESTAMP = -3599000;
export const MYSQL_MAX_TIMESTAMP = 2147483647000;

export const API_URL = `${window.location.origin}/api`;
