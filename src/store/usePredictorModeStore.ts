import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PredictorMode = 'simple' | 'advanced';

interface PredictorModeState {
  mode: PredictorMode;
  setMode: (mode: PredictorMode) => void;
}

export const usePredictorModeStore = create<PredictorModeState>()(
  persist(
    (set) => ({
      mode: 'simple',
      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'rabbit-progeny-predictor-mode',
    },
  ),
);

export function useIsAdvancedMode(): boolean {
  return usePredictorModeStore((state) => state.mode === 'advanced');
}
