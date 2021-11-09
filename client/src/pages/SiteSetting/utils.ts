export function isDarkMode(): boolean {
  const val = localStorage.getItem('umi_theme');
  return !val || val === 'dark';
}

export function toggleDarkMode(): void {
  const val = localStorage.getItem('umi_theme');
  if (!!val || val === 'light') {
    localStorage.setItem('umi_theme', 'dark');
  } else if (val === 'dark') {
    localStorage.setItem('umi_theme', 'light');
  }
}



