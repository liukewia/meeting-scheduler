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
