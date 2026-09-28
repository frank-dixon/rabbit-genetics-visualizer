import { useMemo } from 'react';
import { PARENT_PRESETS } from '../data/meatRabbitBreeds';
import { getPresetBreedingNotes } from '../data/presetBreedingNotes';
import { genotypesEqual, useGeneticStore } from '../store/useGeneticStore';
import { useContentMode } from '../store/useContentModeStore';
import { formatCompactGenotype } from '../utils/formatGenotype';
import { resolveParentPhenotype } from '../utils/geneticEngine';
import { resolvePlainEnglishPhenotype } from '../utils/plainEnglishPhenotype';
import {
  resolveNerdPhenotypeBlurb,
  resolveNerdPhenotypeDetail,
} from '../utils/nerdPhenotype';
import { CompactCollapsible } from './CollapsibleSection';
import { CopyTextButton } from './CopyTextButton';
import { GenotypeInline } from './GenotypeInline';
import { GlossaryTermText } from './GlossaryTermText';
import { ParentGenotypeEditor } from './ParentCrossPanel';
import { PhenotypeRenderer } from './PhenotypeRenderer';
import { PresetPicker } from './PresetPicker';

type ParentKey = 'parent1' | 'parent2';
type GenotypeMap = Record<string, [string, string]>;

interface ParentCompactCardProps {
  parentKey: ParentKey;
  roleLabel: string;
  roleHint: string;
  accentTextClass: string;
  accentBorderClass: string;
  mateGenotype: GenotypeMap;
}

function getVarietyLabel(presetId: string | null, genotype: GenotypeMap): string {
  if (!presetId) return 'Custom genotype';
  const preset = PARENT_PRESETS.find((entry) => entry.id === presetId);
  if (!preset) return 'Custom genotype';
  return genotypesEqual(genotype, preset.genotype)
    ? preset.label
    : `${preset.label} — modified`;
}

export function ParentCompactCard({
  parentKey,
  roleLabel,
  roleHint,
  accentTextClass,
  accentBorderClass,
  mateGenotype,
}: ParentCompactCardProps) {
  const genotype = useGeneticStore((state) => state[parentKey]);
  const presetId = useGeneticStore((state) =>
    parentKey === 'parent1' ? state.parent1PresetId : state.parent2PresetId,
  );
  const loadParentPreset = useGeneticStore((state) => state.loadParentPreset);
  const clearParentPreset = useGeneticStore((state) => state.clearParentPreset);
  const resetParentToPreset = useGeneticStore((state) => state.resetParentToPreset);
  const { isNerd } = useContentMode();

  const phenotype = useMemo(() => resolveParentPhenotype(genotype), [genotype]);
  const plainEnglish = useMemo(() => resolvePlainEnglishPhenotype(genotype), [genotype]);
  const nerdBlurb = useMemo(() => resolveNerdPhenotypeBlurb(genotype), [genotype]);
  const nerdDetail = useMemo(() => resolveNerdPhenotypeDetail(genotype), [genotype]);
  const varietyLabel = useMemo(() => getVarietyLabel(presetId, genotype), [presetId, genotype]);
  const breedingNotes = useMemo(
    () => getPresetBreedingNotes(presetId, genotype),
    [presetId, genotype],
  );
  const activePreset = presetId ? PARENT_PRESETS.find((entry) => entry.id === presetId) : null;
  const isModified = Boolean(activePreset && !genotypesEqual(genotype, activePreset.genotype));
  const compactGenotype = useMemo(() => formatCompactGenotype(genotype), [genotype]);

  const handlePresetChange = (nextPresetId: string | null) => {
    if (!nextPresetId) {
      clearParentPreset(parentKey);
      return;
    }
    const preset = PARENT_PRESETS.find((entry) => entry.id === nextPresetId);
    if (preset) {
      loadParentPreset(parentKey, preset.id, preset.genotype);
    }
  };

  return (
    <article
      className={`rounded-xl border bg-paper/70 dark:bg-espresso/40 p-3 space-y-2.5 ${accentBorderClass}`}
    >
      <div className="flex gap-3">
        <PhenotypeRenderer genotype={genotype} size="sm" className="shrink-0" />

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className={`text-xs font-bold ${accentTextClass}`}>{roleLabel}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">· {roleHint}</span>
          </div>

          <PresetPicker
            id={`${parentKey}-compact-preset`}
            value={presetId}
            onChange={handlePresetChange}
          />

          <p
            className={`text-xs font-semibold leading-snug ${
              isModified ? 'text-amber-700 dark:text-amber-400' : 'text-slate-800 dark:text-slate-100'
            }`}
          >
            {varietyLabel}
          </p>

          {!isNerd && (
            <>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug line-clamp-2">
                <GlossaryTermText text={phenotype} />
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-3">
                {plainEnglish}
              </p>
            </>
          )}

          {isNerd && (
            <div className="space-y-1.5">
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                {nerdBlurb}
              </p>
              <ul className="space-y-1 max-h-28 overflow-y-auto overscroll-contain text-[10px] leading-snug text-slate-500 dark:text-slate-400">
                {nerdDetail.loci.map((locus) => (
                  <li key={locus.id}>
                    <span className="font-mono font-semibold text-teal-deep dark:text-sky-300">
                      {locus.id} {locus.genotype}
                    </span>
                    <span className="text-slate-400"> → {locus.expressed}</span>
                    <span className="block text-slate-500 dark:text-slate-400 line-clamp-2">
                      {locus.detail}
                    </span>
                  </li>
                ))}
              </ul>
              {nerdDetail.interactions.length > 0 && (
                <ul className="list-disc pl-3 space-y-0.5 text-[10px] text-amber-800/90 dark:text-amber-200/80">
                  {nerdDetail.interactions.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      <CompactCollapsible title="Genetics & editing" subtitle={compactGenotype} defaultOpen={false}>
        <div className="space-y-3 pt-1">
          <div className="flex items-start justify-between gap-2">
            <GenotypeInline genotype={genotype} baseline={mateGenotype} />
            <CopyTextButton text={compactGenotype} label="Copy" className="shrink-0" />
          </div>

          {isModified && (
            <button
              type="button"
              onClick={() => activePreset && resetParentToPreset(parentKey, activePreset.genotype)}
              className="text-[10px] text-sky-700 dark:text-sky-400 hover:underline"
            >
              Reset to preset
            </button>
          )}

          {breedingNotes.length > 0 && (
            <ul className="list-disc pl-4 space-y-1 text-[10px] leading-relaxed text-slate-600 dark:text-slate-300">
              {breedingNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          )}

          <ParentGenotypeEditor parentKey={parentKey} mateGenotype={mateGenotype} />
        </div>
      </CompactCollapsible>
    </article>
  );
}
