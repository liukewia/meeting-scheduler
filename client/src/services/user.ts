/** getuserinfo GET /api/currentUser */
export async function queryCurrentUser(options?: { [key: string]: any }) {
  return {
    success: true,
    data: {
      name: 'finn',
      id: '0001',
      role: 'admin',
    },
  };
  // return request('/api/user/current/', {
  //   method: 'GET',
  //   ...(options || {}),
  // });
}

/** log in POST /api/login/account */
export async function login(
  body: API.LoginParams,
  options?: { [key: string]: any },
): Promise<any> {
  return {};
  // return request('/api/user/login/', {
  //   method: 'POST',
  //   // headers: {
  //   //   'Content-Type': 'application/json',
  //   // },
  //   data: body,
  //   ...(options || {}),
  // });
}
