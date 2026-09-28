import { create } from 'zustand';

export type ContentMode = 'simple' | 'nerd';

const STORAGE_KEY = 'contentMode';

function getStoredMode(): ContentMode | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'simple' || stored === 'nerd') {
    return stored;
  }
  return null;
}

function persistMode(mode: ContentMode) {
  localStorage.setItem(STORAGE_KEY, mode);
  document.documentElement.dataset.contentMode = mode;
}

const initialMode = getStoredMode() ?? 'simple';
persistMode(initialMode);

interface ContentModeState {
  mode: ContentMode;
  setMode: (mode: ContentMode) => void;
  toggleMode: () => void;
}

export const useContentModeStore = create<ContentModeState>((set, get) => ({
  mode: initialMode,

  setMode: (mode) => {
    persistMode(mode);
    set({ mode });
  },

  toggleMode: () => {
    const next = get().mode === 'simple' ? 'nerd' : 'simple';
    get().setMode(next);
  },
}));

export function useContentMode() {
  const mode = useContentModeStore((state) => state.mode);
  const setMode = useContentModeStore((state) => state.setMode);
  const toggleMode = useContentModeStore((state) => state.toggleMode);

  return {
    mode,
    setMode,
    toggleMode,
    isNerd: mode === 'nerd',
    isSimple: mode === 'simple',
  };
}
