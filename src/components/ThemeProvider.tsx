import { useEffect } from 'react';
import { applyThemeToDocument, useThemeStore } from '../store/useThemeStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  return children;
}
