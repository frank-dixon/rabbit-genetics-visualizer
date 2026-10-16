import { create } from 'zustand';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function getStoredTheme(): Theme | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return null;
}

export function resolveTheme(): Theme {
  // Palette C ships light only; the dark theme was dropped.
  void getStoredTheme;
  return 'light';
}

export function applyThemeToDocument(theme: Theme) {
  const root = document.documentElement;

  void theme;
  root.classList.remove('light', 'dark');
  root.classList.add('light');
  root.dataset.theme = 'light';
  root.style.colorScheme = 'light';
  localStorage.setItem(STORAGE_KEY, 'light');
}

const initialTheme = resolveTheme();
applyThemeToDocument(initialTheme);

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initialTheme,

  setTheme: (theme) => {
    applyThemeToDocument(theme);
    set({ theme });
  },

  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light';
    get().setTheme(next);
  },
}));

export function useTheme() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
  };
}
