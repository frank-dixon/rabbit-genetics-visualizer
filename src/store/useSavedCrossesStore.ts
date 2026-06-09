import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CrossSnapshot } from '../utils/genotypeCodec';

export interface SavedCross {
  id: string;
  name: string;
  snapshot: CrossSnapshot;
  savedAt: number;
}

interface SavedCrossesState {
  saved: SavedCross[];
  saveCross: (name: string, snapshot: CrossSnapshot) => void;
  deleteCross: (id: string) => void;
}

export const useSavedCrossesStore = create<SavedCrossesState>()(
  persist(
    (set) => ({
      saved: [],

      saveCross: (name, snapshot) =>
        set((state) => ({
          saved: [
            {
              id: crypto.randomUUID(),
              name: name.trim() || 'Untitled cross',
              snapshot,
              savedAt: Date.now(),
            },
            ...state.saved,
          ].slice(0, 20),
        })),

      deleteCross: (id) =>
        set((state) => ({
          saved: state.saved.filter((entry) => entry.id !== id),
        })),
    }),
    {
      name: 'rabbit-progeny-saved-crosses',
    },
  ),
);
