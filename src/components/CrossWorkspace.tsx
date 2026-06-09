import { useMemo } from 'react';
import { ParentCompactCard } from './ParentCompactCard';
import { ParentDiffStrip } from './ParentDiffStrip';
import { ProgenyOutcomesPanel } from './ProgenyOutcomesPanel';
import { CopyTextButton } from './CopyTextButton';
import { ExampleCrossChips } from './ExampleCrossChips';
import { SavedCrossesPanel } from './SavedCrossesPanel';
import { useGeneticStore } from '../store/useGeneticStore';
import { buildCrossShareUrl } from '../utils/genotypeCodec';

export type CrossWorkspaceSection = 'all' | 'parents' | 'outcomes';

interface CrossWorkspaceProps {
  section?: CrossWorkspaceSection;
}

export function CrossWorkspace({ section = 'all' }: CrossWorkspaceProps) {
  const swapParents = useGeneticStore((state) => state.swapParents);
  const parent1 = useGeneticStore((state) => state.parent1);
  const parent2 = useGeneticStore((state) => state.parent2);
  const parent1PresetId = useGeneticStore((state) => state.parent1PresetId);
  const parent2PresetId = useGeneticStore((state) => state.parent2PresetId);

  const shareUrl = useMemo(
    () =>
      buildCrossShareUrl({
        parent1,
        parent2,
        parent1PresetId,
        parent2PresetId,
      }),
    [parent1, parent2, parent1PresetId, parent2PresetId],
  );

  const showParents = section === 'all' || section === 'parents';
  const showOutcomes = section === 'all' || section === 'outcomes';
  const showHeader = section !== 'outcomes';

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
      {section === 'outcomes' && (
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 sm:px-5">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
            Progeny outcomes
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tap an outcome to highlight loci in the Chromosome Explorer.
          </p>
        </div>
      )}

      {showHeader && (
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 sm:px-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">Your cross</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Set both parents, then scan predicted progeny below.
            </p>
          </div>
          <CopyTextButton
            text={shareUrl}
            label="Copy share link"
            copiedLabel="Link copied"
            className="shrink-0 mt-0.5"
          />
        </div>
      )}

      <div className="p-4 sm:p-5 space-y-4">
        {showParents && (
          <>
            <ExampleCrossChips />
            <SavedCrossesPanel />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ParentCompactCard
                parentKey="parent1"
                roleLabel="Parent A"
                roleHint="Dam"
                accentTextClass="text-rose-700 dark:text-rose-400"
                accentBorderClass="border-rose-200 dark:border-rose-900/50"
                mateGenotype={parent2}
              />
              <ParentCompactCard
                parentKey="parent2"
                roleLabel="Parent B"
                roleHint="Sire"
                accentTextClass="text-indigo-700 dark:text-indigo-400"
                accentBorderClass="border-indigo-200 dark:border-indigo-900/50"
                mateGenotype={parent1}
              />
            </div>

            <ParentDiffStrip />

            <div className="flex justify-center -my-1">
              <button
                type="button"
                onClick={swapParents}
                className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-sky-700 dark:hover:text-sky-400 hover:underline transition focus:outline-none focus:underline"
              >
                Swap parents
              </button>
            </div>
          </>
        )}

        {showOutcomes && <ProgenyOutcomesPanel />}

        {section === 'all' && (
          <p className="text-[10px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
            Draft previews and genetics — verify before breeding. Click a progeny outcome to
            highlight its loci in the Chromosome Explorer.
          </p>
        )}
      </div>
    </section>
  );
}
