export const PREFIX_CLS = 'ant';
export const LOGIN_PATH = '/user/login';
export const SIGN_UP_PATH = 'user/signup';

// achieve O(1) searching time in time complexity
export const UN_AUTH_PATHS: { [key: string]: true } = {
  [LOGIN_PATH]: true,
  [SIGN_UP_PATH]: true,
};

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
  Settings2 = 'settings2',
}
