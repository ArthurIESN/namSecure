import React, { createContext, useContext, ReactNode } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ColorScheme = 'light' | 'dark';

interface ThemeContextType {
  colorScheme: ColorScheme;
}

const ThemeContext = createContext<ThemeContextType>({ colorScheme: 'dark' });

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme() ?? 'dark';

  return (
    <ThemeContext.Provider value={{ colorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
