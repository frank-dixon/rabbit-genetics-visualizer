import { usePredictorModeStore, type PredictorMode } from '../store/usePredictorModeStore';

const MODES: { id: PredictorMode; label: string }[] = [
  { id: 'simple', label: 'Simple' },
  { id: 'advanced', label: 'Advanced' },
];

export function PredictorModeToggle() {
  const mode = usePredictorModeStore((state) => state.mode);
  const setMode = usePredictorModeStore((state) => state.setMode);

  return (
    <div
      className="inline-flex items-center rounded-full border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 p-0.5 shadow-sm"
      role="group"
      aria-label="Predictor mode"
    >
      {MODES.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => setMode(option.id)}
          aria-pressed={mode === option.id}
          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all duration-200 ${
            mode === option.id
              ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
