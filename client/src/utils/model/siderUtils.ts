// import {
//   SessionStorageItems,
//   SiderOpenedKey,
//   SiderSelectedKey,
// } from '@/constants';

// export const getSiderSelectedKeys = () => {
//   const keys = sessionStorage.getItem(SessionStorageItems.SiderSelectedKey);
//   if (keys === null) {
//     return null;
//   }
//   return JSON.parse(keys) as SiderSelectedKey[];
// };

// export const serializeSiderSelectedKeys = (newKeys: string[]): void => {
//   sessionStorage.setItem(
//     SessionStorageItems.SiderSelectedKey,
//     JSON.stringify(newKeys),
//   );
// };

// export const initSiderSelectedKeys = () => {
//   if (getSiderSelectedKeys() === null) {
//     serializeSiderSelectedKeys([SiderSelectedKey.Home]);
//   }
// };


// export const getSiderOpenedKeys = () => {
//   const keys = sessionStorage.getItem(SessionStorageItems.SiderOpenedKeys);
//   if (keys === null) return null;
//   return JSON.parse(keys);
// };

// export const serializeSiderOpenedKeys = (newKeys: string[]): void => {
//   sessionStorage.setItem(
//     SessionStorageItems.SiderOpenedKeys,
//     JSON.stringify(newKeys),
//   );
// };

// export const initSiderOpenedKeys = () => {
//   if (getSiderOpenedKeys() === null) {
//     serializeSiderOpenedKeys([]);
//   }
// };


// export const initSider = (pathname: string, siderItems: any) => {
//   pathname = pathname.replace(/\/$/, '');
//   const match = (routes: any) =>
//     routes.some((item: any) => {
//       if (item.children) {
//         return match(item.children);
//       }
//       return item.path === pathname;
//     });
//   if (!match(siderItems)) {
//     return;
//   }
//   const tmp = pathname.split('/').filter((e) => e !== '');
//   const selectedKey = tmp.join('-');
//   serializeSiderSelectedKeys([selectedKey]);
//   console.log('tmp: ', tmp);
//   const superOpenedKey = tmp.slice(0, tmp.length - 1);
//   console.log('getSiderOpenedKeys(): ', getSiderOpenedKeys());
//   if (!getSiderOpenedKeys()) {
//     if (superOpenedKey.length) {
//       serializeSiderOpenedKeys([superOpenedKey.join('/')]);
//     } else {
//       serializeSiderOpenedKeys([]);
//     }
//   }
// };
