import moment from 'moment';
import type { Moment } from 'moment';
import { ONE_HOUR_MILLIS } from '@/constants';

export function disabledDate(current: Moment) {
  return (
    current &&
    (current < moment('1970-01-01 00:00 +0000', 'YYYY-MM-DD HH:mm Z') ||
      current > moment('2038-01-19 03:14 +0000', 'YYYY-MM-DD HH:mm Z'))
  );
}

export interface Timezone {
  key: string;
  label: string;
  value: number;
}

export function utcOffsetToTxt(utcOffset: number) {
  const duration = moment.duration(utcOffset);
  return `UTC ${utcOffset > 0 ? '+' : ''}${duration.hours()}:${duration
    .minutes()
    .toString()
    .padStart(2, '0')}`;
}
