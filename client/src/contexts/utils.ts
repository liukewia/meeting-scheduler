import { ThemeType } from "./ThemeContext";

export function getAppThemeFromLocalStorage() {
  return (localStorage.getItem('app-theme') || 'light') as ThemeType;
}
