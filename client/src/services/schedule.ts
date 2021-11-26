import axiosReq from './axiosSetting';

/** get currentUser GET /api/schedule/search */
export async function searchSchdule(
  params?: {
    [key: string]: any;
  },
  options?: {
    [key: string]: any;
  },
): Promise<any> {
  const res = await axiosReq('/schedule/search', {
    method: 'GET',
    params,
    ...(options || {}),
  });
  return res;
}

/** add Schdule POST /api/schedule/add */
export async function addSchdule(
  body: any,
  options?: { [key: string]: any },
): Promise<any> {
  const res = await axiosReq('/schedule/add', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
  return res;
}

/** update Schdule POST /api/schedule/update */
export async function updateSchdule(
  body: any,
  options?: { [key: string]: any },
): Promise<any> {
  const res = await axiosReq('/schedule/update', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
  return res;
}

/** delete Schdule POST /api/schedule/delete */
export async function deleteSchdule(
  body: any,
  options?: { [key: string]: any },
): Promise<any> {
  const res = await axiosReq('/schedule/delete', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
  return res;
}
