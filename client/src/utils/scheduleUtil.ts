import moment from 'moment';

export function parseEventInForm(event) {
  return {
    ...event,
    time: [moment(event.start), moment(event.end)],
  };
}

export function mapPriorityIdToPercentage(id: number) {
  const map = {
    0: 0,
    1: 25,
    2: 50,
    3: 75,
    10: 100,
  };
  const val = map[id];
  if (val === undefined) return 0;
  return val;
}
