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
  // Cool Spectrum ships dark-first; honor stored choice but default dark.
  return getStoredTheme() ?? 'dark';
}

export function applyThemeToDocument(theme: Theme) {
  const root = document.documentElement;

  root.classList.remove('light', 'dark');
  // Cool Spectrum is dark-only: keep dark: utilities active in both modes.
  root.classList.add('dark');
  if (theme === 'light') {
    root.classList.add('light');
  }
  root.dataset.theme = theme;
  root.style.colorScheme = 'dark';
  localStorage.setItem(STORAGE_KEY, theme);
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
