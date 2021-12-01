import axiosReq from './axiosSetting';

/** get ZoneOffsetLis GET /api/zoneoffset/getlist */
export async function getZoneOffsetList(
  params?: {
    [key: string]: any;
  },
  options?: {
    [key: string]: any;
  },
): Promise<any> {
  const res = await axiosReq('/zoneoffset/getlist', {
    method: 'GET',
    params,
    ...(options || {}),
  });
  return res;
}

