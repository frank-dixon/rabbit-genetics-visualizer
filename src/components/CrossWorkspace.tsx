import { ArrowLeftRight } from 'lucide-react';
import { ParentCompactCard } from './ParentCompactCard';
import { ProgenyOutcomesPanel } from './ProgenyOutcomesPanel';
import { useGeneticStore } from '../store/useGeneticStore';

export function CrossWorkspace() {
  const swapParents = useGeneticStore((state) => state.swapParents);

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 sm:px-5">
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">Your cross</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Set both parents, then scan predicted progeny below.
        </p>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ParentCompactCard
            parentKey="parent1"
            roleLabel="Parent A"
            roleHint="Dam"
            accentTextClass="text-rose-700 dark:text-rose-400"
            accentBorderClass="border-rose-200 dark:border-rose-900/50"
          />
          <ParentCompactCard
            parentKey="parent2"
            roleLabel="Parent B"
            roleHint="Sire"
            accentTextClass="text-indigo-700 dark:text-indigo-400"
            accentBorderClass="border-indigo-200 dark:border-indigo-900/50"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={swapParents}
            className="inline-flex items-center gap-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-900 transition focus:outline-none focus:ring-2 focus:ring-sky-400 min-h-[44px]"
          >
            <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden="true" />
            Swap parents
          </button>
        </div>

        <ProgenyOutcomesPanel />

        <p className="text-[10px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
          Draft previews and genetics — verify before breeding. Open Variety notes on each parent for
          cross-breeding context.
        </p>
      </div>
    </section>
  );
}
