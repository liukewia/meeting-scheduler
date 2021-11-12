export type ThemeType = 'light' | 'dark';

export function getAppThemeFromLocalStorage() {
  return (localStorage.getItem('app-theme') || 'light') as ThemeType;
}
