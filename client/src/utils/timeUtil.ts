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

// https://github.com/dmfilipenko/timezones.json
import TIME_ZONES from './timezone.min.json';

export interface Timezone {
  key: string;
  label: string;
  value: number;
}

export const getTimezoneSelectOptions = () => {
  return TIME_ZONES.map((timeZone) => ({
    key: timeZone.key,
    label: timeZone.text,
  }));
};

export const getCurrentTimePart = (utcOffset: number): string => {
  const hours = moment.utc().hours() + utcOffset / ONE_HOUR_MILLIS;
  let time = '';
  if (hours < 12) {
    time = 'morning';
  } else if (hours < 18) {
    time = 'afternoon';
  } else {
    time = 'evening';
  }
  return time;
};

export function utcOffsetToTxt(utcOffset: number) {
  return `UTC ${(utcOffset > 0 ? '+' : '') + utcOffset / ONE_HOUR_MILLIS}`;
}
