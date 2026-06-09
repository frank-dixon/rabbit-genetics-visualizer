import { useMemo } from 'react';
import { PARENT_PRESETS } from '../data/meatRabbitBreeds';
import { getPresetBreedingNotes } from '../data/presetBreedingNotes';
import { genotypesEqual, useGeneticStore } from '../store/useGeneticStore';
import { formatCompactGenotype } from '../utils/formatGenotype';
import { resolveParentPhenotype } from '../utils/geneticEngine';
import { resolvePlainEnglishPhenotype } from '../utils/plainEnglishPhenotype';
import { CompactCollapsible } from './CollapsibleSection';
import { CopyTextButton } from './CopyTextButton';
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
}: ParentCompactCardProps) {
  const genotype = useGeneticStore((state) => state[parentKey]);
  const presetId = useGeneticStore((state) =>
    parentKey === 'parent1' ? state.parent1PresetId : state.parent2PresetId,
  );
  const loadParentPreset = useGeneticStore((state) => state.loadParentPreset);
  const clearParentPreset = useGeneticStore((state) => state.clearParentPreset);
  const resetParentToPreset = useGeneticStore((state) => state.resetParentToPreset);

  const phenotype = useMemo(() => resolveParentPhenotype(genotype), [genotype]);
  const plainEnglish = useMemo(() => resolvePlainEnglishPhenotype(genotype), [genotype]);
  const varietyLabel = useMemo(() => getVarietyLabel(presetId, genotype), [presetId, genotype]);
  const compactGenotype = useMemo(() => formatCompactGenotype(genotype), [genotype]);
  const breedingNotes = useMemo(
    () => getPresetBreedingNotes(presetId, genotype),
    [presetId, genotype],
  );
  const activePreset = presetId ? PARENT_PRESETS.find((entry) => entry.id === presetId) : null;
  const isModified = Boolean(activePreset && !genotypesEqual(genotype, activePreset.genotype));
  const notesPreview = breedingNotes[0] ?? 'Genetics and cross-breeding tips';

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
      className={`rounded-lg border bg-slate-50/80 dark:bg-slate-950/40 p-3 space-y-2.5 ${accentBorderClass}`}
    >
      <div className="flex gap-3">
        <PhenotypeRenderer genotype={genotype} size="sm" className="shrink-0 mt-0.5" />

        <div className="flex-1 min-w-0 space-y-2">
          <div>
            <div className={`text-xs font-bold ${accentTextClass}`}>{roleLabel}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">{roleHint}</div>
          </div>

          <div>
            <label
              htmlFor={`${parentKey}-compact-preset`}
              className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1"
            >
              Variety preset
            </label>
            <PresetPicker
              id={`${parentKey}-compact-preset`}
              value={presetId}
              onChange={handlePresetChange}
            />
          </div>

          <p
            className={`text-xs font-semibold leading-snug ${
              isModified ? 'text-amber-700 dark:text-amber-400' : 'text-slate-800 dark:text-slate-100'
            }`}
          >
            {varietyLabel}
          </p>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">{phenotype}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug italic">
            {plainEnglish}
          </p>

          <div className="flex items-start justify-between gap-2">
            <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 leading-relaxed break-words flex-1">
              {compactGenotype}
            </p>
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
        </div>
      </div>

      <CompactCollapsible title="Variety notes" subtitle={notesPreview}>
        <ul className="list-disc pl-4 space-y-1.5 text-[10px] leading-relaxed text-slate-600 dark:text-slate-300">
          {breedingNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </CompactCollapsible>

      <CompactCollapsible title="Edit genotype" subtitle="Per-locus allele selectors">
        <ParentGenotypeEditor parentKey={parentKey} />
      </CompactCollapsible>
    </article>
  );
}
