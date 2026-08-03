import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import useLocalStorage from './useLocalStorage';

export const themes = ['blue', 'orange', 'sakura', 'nature', 'dark'] as const;
export type Theme = (typeof themes)[number];

interface ThemeInfo {
  name: string;
  label: string;
  color: string;
}

export const themeInfoMap: Record<Theme, ThemeInfo> = {
  blue:   { name: 'blue',   label: '商务蓝', color: '#2563EB' },
  orange: { name: 'orange', label: '活力橙', color: '#EA580C' },
  sakura: { name: 'sakura', label: '樱花粉', color: '#DB2777' },
  nature: { name: 'nature', label: '自然绿', color: '#16A34A' },
  dark:   { name: 'dark',   label: '暗夜黑', color: '#334155' },
};

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: 'blue', setTheme: () => {} });

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<Theme>('app-theme-v2', 'blue');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
