import { useState, useMemo } from 'react';
import { getAppThemeFromLocalStorage, ThemeType } from './utils';

export default () => {
  const [theme, toggleTheme] = useState<ThemeType>(
    getAppThemeFromLocalStorage(),
  );

  const isLightTheme = useMemo(() => {
    return getAppThemeFromLocalStorage() === 'light';
  }, [theme, getAppThemeFromLocalStorage]);

  const isDarkTheme = useMemo(() => {
    return getAppThemeFromLocalStorage() === 'dark';
  }, [theme, getAppThemeFromLocalStorage]);

  return {
    theme,
    toggleTheme,
    isLightTheme,
    isDarkTheme,
  };
};
