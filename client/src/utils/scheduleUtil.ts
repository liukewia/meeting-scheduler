import { CalendarEvent } from '@/pages/MyTimetable/components/Calendar';
import moment from 'moment';

export function parseEventInForm(event: Partial<CalendarEvent>) {
  return {
    ...event,
    time: [moment(event.start), moment(event.end)],
  };
}

export function mapPriorityIdToPercent(id: number) {
  const map: { [key: string]: number } = {
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

export function mapPercentToPriorityId(percentage: number) {
  const map: { [key: string]: number } = {
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

export function mapPriorityPercentToColor(percentage: number) {
  const map: { [key: string]: string } = {
    0: 'lime', // none
    25: 'magenta', // low
    50: 'orange', // normal
    75: 'volcano', // high
    100: 'red', // inf
  };

  const color = map[percentage];
  if (color === undefined) return 'orange';
  return color;
}

export function mapPriorityPercentToTxt(percentage: number) {
  const map: { [key: string]: string } = {
    0: 'None', // none
    25: 'Low', // low LIGHT_GREEN
    50: 'Normal', // normal ORANGE
    75: 'High', // high YELLOW
    100: 'Inf', // inf DARK_RED
  };

  const txt = map[percentage];
  if (txt === undefined) return 'Normal';
  return txt;
}
