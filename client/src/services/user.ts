import { AccordionSummaryTypeMap } from '@material-ui/core';
import request from './axiosSetting';

/** getuserinfo GET /api/currentUser */
export async function queryCurrentUser(options?: { [key: string]: any }) {
  // will throw 404 error if not logged in,

  return {
    success: false,
    data: {},
  };

  // return {
  //   success: true,
  //   data: {
  //     name: 'finn',
  //     id: '0001',
  //     role: 'admin',
  //   },
  // };

  // return request('/api/user/current/', {
  //   method: 'GET',
  //   ...(options || {}),
  // });
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
