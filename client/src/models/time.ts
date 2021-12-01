import moment from 'moment';
import type { Moment } from 'moment';
import { useCallback } from 'react';
import { useModel } from 'umi';

export default () => {
  const { initialState } = useModel('@@initialState');
  const utcOffset = initialState?.currentUser?.utcOffset || 0;

  const getUtcNow = useCallback(() => moment.utc(), [moment]);

  const getZonedUtcNow: () => Moment = useCallback(
    () => moment.utc().add(utcOffset, 'ms'),
    [initialState, moment],
  );

  return {
    getUtcNow,
    getZonedUtcNow,
  };
};
