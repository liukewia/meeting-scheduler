import axiosReq from './axiosSetting';

/** plan meeting POST /api/meeting/plan */
export async function planMeeting(
  body: any,
  options?: { [key: string]: any },
): Promise<any> {
  const res = await axiosReq('/meeting/plan', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
  return res;
}

/** plan meeting POST /api/sheet/upload */
export async function sheetUpload(
  body: any,
  options?: { [key: string]: any },
): Promise<any> {
  const formData = new FormData();
  Object.keys(body).forEach((key) => formData.set(key, body[key]));
  const res = await axiosReq('/sheet/upload', {
    method: 'POST',
    data: formData,
    ...(options || {}),
  });
  return res;
}
