import {
  SessionStorageItems,
  SiderOpenedKey,
  SiderSelectedKey,
} from '@/constants';

export const getSiderSelectedKeys = () => {
  const keys = sessionStorage.getItem(SessionStorageItems.SiderSelectedKey);
  if (keys === null) {
    return [];
  }
  return JSON.parse(keys) as SiderSelectedKey[];
};

export const serializeSiderSelectedKeys = (newKeys: string[]): void => {
  sessionStorage.setItem(
    SessionStorageItems.SiderSelectedKey,
    JSON.stringify(newKeys),
  );
};

export const initSiderSelectedKeys = () => {
  if (sessionStorage.getItem(SessionStorageItems.SiderSelectedKey) === null) {
    serializeSiderSelectedKeys([SiderSelectedKey.Home]);
  }
};

export const getSiderOpenedKeys = () => {
  const keys = sessionStorage.getItem(SessionStorageItems.SiderOpenedKeys);
  if (keys === null) return [];
  return JSON.parse(keys);
};

export const serializeSiderOpenedKeys = (newKeys: string[]): void => {
  sessionStorage.setItem(
    SessionStorageItems.SiderOpenedKeys,
    JSON.stringify(newKeys),
  );
};

export const initSiderOpenedKeys = () => {
  if (sessionStorage.getItem(SessionStorageItems.SiderOpenedKeys) === null) {
    serializeSiderOpenedKeys([]);
  }
};
