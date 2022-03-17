import axiosReq from './axiosSetting';

/** get currentUser GET /api/schedule/search */
export async function searchSchedule(
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

/** add Schedule POST /api/schedule/add */
export async function addSchedule(
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

/** update Schedule POST /api/schedule/update */
export async function updateSchedule(
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

/** delete Schedule POST /api/schedule/delete */
export async function deleteSchedule(
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

