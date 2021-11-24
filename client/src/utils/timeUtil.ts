import moment from 'moment';

export function disabledDate(current) {
  return (
    current &&
    (current < moment('1970-01-01 00:00 +0000', 'YYYY-MM-DD HH:mm Z') ||
      current > moment('2038-01-19 03:14 +0000', 'YYYY-MM-DD HH:mm Z'))
  );
}
