import { AccordionSummaryTypeMap } from '@material-ui/core';
import request from './axiosSetting';

/** get currentUser GET /api/user/currentUser */
/** log out POST /api/user/currentUser */
export async function queryCurrentUser(options?: {
  [key: string]: any;
}): Promise<any> {
  const res = await request('/user/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
  return res;
}

/** log in POST /api/user/login */
export async function login(
  body: API.LoginParams,
  options?: { [key: string]: any },
): Promise<any> {
  // return {};
  const res = await request('/user/login', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
  return res;
}

/** log out POST /api/user/logout */
export async function logout(options?: { [key: string]: any }): Promise<any> {
  const res = await request('/user/logout', {
    method: 'POST',
    ...(options || {}),
  });
  return res;
}

/** log in POST /api/user/signup */
export async function signup(
  body: any,
  options?: { [key: string]: any },
): Promise<any> {
  const res = await request('/user/signup', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
  return res;
}

export async function userIndex(options?: {
  [key: string]: any;
}): Promise<any> {
  const res = await request('/user/index', {
    method: 'get',
    ...(options || {}),
  });
  return res;
}
