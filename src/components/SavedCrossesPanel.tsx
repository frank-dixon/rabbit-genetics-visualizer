import { useState } from 'react';
import { PARENT_PRESETS } from '../data/meatRabbitBreeds';
import { useGeneticStore } from '../store/useGeneticStore';
import { useSavedCrossesStore } from '../store/useSavedCrossesStore';

function presetLabel(presetId: string | null): string {
  if (!presetId) return 'Custom';
  return PARENT_PRESETS.find((entry) => entry.id === presetId)?.label ?? 'Custom';
}

export function SavedCrossesPanel() {
  const [name, setName] = useState('');
  const getCrossSnapshot = useGeneticStore((state) => state.getCrossSnapshot);
  const loadCrossSnapshot = useGeneticStore((state) => state.loadCrossSnapshot);
  const parent1PresetId = useGeneticStore((state) => state.parent1PresetId);
  const parent2PresetId = useGeneticStore((state) => state.parent2PresetId);
  const saved = useSavedCrossesStore((state) => state.saved);
  const saveCross = useSavedCrossesStore((state) => state.saveCross);
  const deleteCross = useSavedCrossesStore((state) => state.deleteCross);

  const defaultName = `${presetLabel(parent1PresetId)} × ${presetLabel(parent2PresetId)}`;

  const handleSave = () => {
    saveCross(name.trim() || defaultName, getCrossSnapshot());
    setName('');
  };

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/30 p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-200">Saved crosses</h3>
        <span className="text-[10px] text-slate-500 dark:text-slate-400">{saved.length}/20</span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={defaultName}
          className="flex-1 text-xs rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
        <button
          type="button"
          onClick={handleSave}
          className="text-xs font-medium rounded-md border border-sky-300 dark:border-sky-700 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-200 px-3 py-1.5 hover:bg-sky-100 dark:hover:bg-sky-950/60"
        >
          Save
        </button>
      </div>

      {saved.length === 0 ? (
        <p className="text-[10px] text-slate-500 dark:text-slate-400">
          Save dam × sire combos you plan to repeat.
        </p>
      ) : (
        <ul className="space-y-1.5 max-h-36 overflow-y-auto overscroll-contain">
          {saved.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between gap-2 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5"
            >
              <button
                type="button"
                onClick={() => loadCrossSnapshot(entry.snapshot)}
                className="text-left text-slate-800 dark:text-slate-100 hover:text-sky-700 dark:hover:text-sky-400 truncate"
              >
                {entry.name}
              </button>
              <button
                type="button"
                onClick={() => deleteCross(entry.id)}
                className="text-[10px] text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 shrink-0"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
