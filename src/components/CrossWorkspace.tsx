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


  const parentsRail = (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-teal">
            Breeding desk
          </p>
          <h2 className="text-base font-semibold text-ink leading-tight">Dam &amp; Sire</h2>
        </div>
        <CopyTextButton
          text={shareUrl}
          label="Share"
          copiedLabel="Copied"
          className="shrink-0"
        />
      </div>

      <ExampleCrossChips />

      <div className="grid grid-cols-1 gap-3">
        <ParentCompactCard
          parentKey="parent1"
          roleLabel="Dam"
          roleHint="Parent A"
          accentTextClass="text-rose-700 dark:text-rose-400"
          accentBorderClass="border-rose-200/80 dark:border-rose-900/40"
          mateGenotype={parent2}
        />
        <ParentCompactCard
          parentKey="parent2"
          roleLabel="Sire"
          roleHint="Parent B"
          accentTextClass="text-teal-deep dark:text-sky-300"
          accentBorderClass="border-teal/30 dark:border-sky-800/50"
          mateGenotype={parent1}
        />
      </div>

      <div className="flex flex-col items-center gap-1">
        <ParentDiffStrip />
        <button
          type="button"
          onClick={swapParents}
          className="text-[10px] text-ink-muted dark:text-slate-400 hover:text-teal-deep dark:hover:text-sky-300 hover:underline transition focus:outline-none focus:underline"
        >
          Swap Dam / Sire
        </button>
      </div>

      <SavedCrossesPanel />
    </div>
  );

  const outcomesHero = (
    <div className="space-y-2 h-full min-h-0 flex flex-col">
      <div className="shrink-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-teal">
          Outcomes
        </p>
        <h2 className="text-base font-semibold text-ink leading-tight">Progeny</h2>
      </div>
      <div className="flex-1 min-h-0">
        <ProgenyOutcomesPanel />
      </div>
    </div>
  );

  if (section === 'parents') {
    return (
      <section className="surface-card p-4 sm:p-5">{parentsRail}</section>
    );
  }

  if (section === 'outcomes') {
    return (
      <section className="surface-card p-4 sm:p-5">{outcomesHero}</section>
    );
  }

  // Breeding desk: left Dam/Sire rail, right Progeny hero (not a Compare strip wizard)
  return (
    <section className="surface-card overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:divide-x divide-rule/80 dark:divide-rule-dark/60">
        <div className="lg:col-span-5 p-4 sm:p-5 border-b lg:border-b-0 border-rule/80 dark:border-rule-dark/60">
          {parentsRail}
        </div>
        <div className="lg:col-span-7 p-4 sm:p-5 bg-paper/40 dark:bg-espresso/30">
          {outcomesHero}
        </div>
      </div>
    </section>
  );
}
