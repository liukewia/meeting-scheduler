import { createContext } from 'react';
import { getAppThemeFromLocalStorage } from './utils';

export type ThemeType = 'light' | 'dark';

// export interface ThemeContextType {
//   theme: ThemeType;
//   toggleTheme: () => void;
// }

const ThemeContext = createContext({
  theme: getAppThemeFromLocalStorage(),
  isLightTheme: getAppThemeFromLocalStorage() === 'light',
  isDark: getAppThemeFromLocalStorage() === 'dark',
  toggleTheme: () => {},
});

export default ThemeContext;
