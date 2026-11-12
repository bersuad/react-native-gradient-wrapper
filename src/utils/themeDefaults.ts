import type { ColorSchemeName } from 'react-native';

export const getDefaultGradients = (
  theme: 'light' | 'dark' | 'auto',
  systemTheme: ColorSchemeName = 'light',
): {
  background: string[];
  border: string[];
} => {
  const isDark = theme === 'dark' || (theme === 'auto' && systemTheme === 'dark');

  return {
    background: isDark ? ['#2c3e50', '#1a1a1a'] : ['#ffffff', '#f2f2f2'],
    border: isDark ? ['#4b6cb7', '#182848'] : ['#ccc', '#eee'],
  };
};
