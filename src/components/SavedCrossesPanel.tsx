import { PARENT_PRESETS } from '../data/meatRabbitBreeds';
import { useGeneticStore } from '../store/useGeneticStore';
import { useSavedCrossesStore } from '../store/useSavedCrossesStore';
import { CompactCollapsible } from './CollapsibleSection';

function presetLabel(presetId: string | null): string {
  if (!presetId) return 'Custom';
  return PARENT_PRESETS.find((entry) => entry.id === presetId)?.label ?? 'Custom';
}

export function SavedCrossesPanel() {
  const getCrossSnapshot = useGeneticStore((state) => state.getCrossSnapshot);
  const loadCrossSnapshot = useGeneticStore((state) => state.loadCrossSnapshot);
  const parent1PresetId = useGeneticStore((state) => state.parent1PresetId);
  const parent2PresetId = useGeneticStore((state) => state.parent2PresetId);
  const saved = useSavedCrossesStore((state) => state.saved);
  const saveCross = useSavedCrossesStore((state) => state.saveCross);
  const deleteCross = useSavedCrossesStore((state) => state.deleteCross);

  const crossName = `${presetLabel(parent1PresetId)} × ${presetLabel(parent2PresetId)}`;

  const handleSave = () => {
    saveCross(crossName, getCrossSnapshot());
  };

  const subtitle =
    saved.length === 0 ? 'One-click save for pairings you repeat' : `${saved.length} saved`;

  return (
    <CompactCollapsible
      title={
        <span>
          Saved crosses{' '}
          <span className="font-normal text-slate-400 dark:text-slate-500">({saved.length}/20)</span>
        </span>
      }
      subtitle={subtitle}
    >
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between gap-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-2">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Save this cross
            </p>
            <p className="text-xs text-slate-800 dark:text-slate-100 truncate mt-0.5">{crossName}</p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="text-xs font-medium shrink-0 rounded-md border border-sky-300 dark:border-sky-700 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-200 px-3 py-1.5 hover:bg-sky-100 dark:hover:bg-sky-950/60"
          >
            Save
          </button>
        </div>

        {saved.length > 0 && (
          <ul className="space-y-1 max-h-32 overflow-y-auto overscroll-contain">
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
    </CompactCollapsible>
  );
}
