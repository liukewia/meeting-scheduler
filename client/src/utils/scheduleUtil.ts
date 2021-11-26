import moment from 'moment';

export function parseEventInForm(event) {
  return {
    ...event,
    time: [moment(event.start), moment(event.end)],
  };
}

export function mapPriorityIdToPercentage(id: number) {
  const map = {
    0: 0, // none
    1: 25, // low
    2: 50, // normal
    3: 75, // high
    10: 100, // inf
  };

  const percentage = map[id];
  if (percentage === undefined) return 0;
  return percentage;
}

export function mapPercentageToPriorityId(percentage: number) {
  const map = {
    0: 0, // none
    25: 1, // low
    50: 2, // normal
    75: 3, // high
    100: 10, // inf
  };

  const id = map[percentage];
  if (id === undefined) return 2;
  return id;
}
