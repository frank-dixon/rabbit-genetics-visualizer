import { useMemo } from 'react';
import { PairingRow } from './PairingRow';
import { ParentDiffStrip } from './ParentDiffStrip';
import { ProgenyOutcomesPanel } from './ProgenyOutcomesPanel';
import { CopyTextButton } from './CopyTextButton';
import { ExampleCrossChips } from './ExampleCrossChips';
import { SavedCrossesPanel } from './SavedCrossesPanel';
import { useGeneticStore } from '../store/useGeneticStore';
import { buildCrossShareUrl } from '../utils/genotypeCodec';

/** Option A (MorphMarket-style): Dam × Sire fields on top, live results table directly under. */
export function CrossWorkspace() {
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


  return (
    <div className="space-y-5">
      <section className="glass p-4 sm:p-6" aria-labelledby="pairing-title">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow kicker text-[10px] text-ink-muted">Predict a litter</p>
            <h1 id="pairing-title" className="headline-solid text-2xl sm:text-3xl">
              Pairing
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={swapParents}
              className="kicker text-[10px] text-[var(--link)] hover:text-ink"
            >
              Swap
            </button>
            <CopyTextButton text={shareUrl} label="Share" copiedLabel="Copied" className="shrink-0" />
          </div>
        </div>
        <div className="mb-4">
          <ExampleCrossChips />
        </div>
        <PairingRow />
        <div className="mt-4 border-t border-rule pt-3">
          <ParentDiffStrip />
        </div>
      </section>

      <section className="px-0" aria-label="Outcomes">
        <ProgenyOutcomesPanel />
      </section>

      <SavedCrossesPanel />
    </div>
  );
}
