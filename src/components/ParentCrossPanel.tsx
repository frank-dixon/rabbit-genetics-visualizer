import { useMemo } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { PARENT_PRESET_CATEGORIES, PARENT_PRESETS } from '../data/meatRabbitBreeds';
import {
  LOCI_ORDER,
  RABBIT_GENETIC_MAP,
  type Allele,
  type Locus,
} from '../data/rabbitGenetics';
import { genotypesEqual, useGeneticStore } from '../store/useGeneticStore';
import { resolveParentPhenotype } from '../utils/geneticEngine';

type ParentKey = 'parent1' | 'parent2';
type GenotypeMap = Record<string, [string, string]>;

function formatAlleleOptionLabel(allele: Allele): string {
  return `${allele.code} — ${allele.name}`;
}

function getVarietyDisplayLabel(presetId: string | null, genotype: GenotypeMap): string {
  if (!presetId) return 'Custom';

  const preset = PARENT_PRESETS.find((entry) => entry.id === presetId);
  if (!preset) return 'Custom';

  const modified = !genotypesEqual(genotype, preset.genotype);
  return modified ? `${preset.label} — modified` : preset.label;
}

interface ParentRabbitCardProps {
  parentKey: ParentKey;
  title: string;
  subtitle: string;
  accentClass: string;
}

interface LocusAlleleSelectProps {
  locus: Locus;
  parentKey: ParentKey;
  alleleIndex: 0 | 1;
  value: string;
  highlighted: boolean;
  onSelectLocus: (locusId: string) => void;
  onChange: (alleleCode: string) => void;
}

function LocusAlleleSelect({
  locus,
  parentKey,
  alleleIndex,
  value,
  highlighted,
  onSelectLocus,
  onChange,
}: LocusAlleleSelectProps) {
  const labelId = `${parentKey}-${locus.id}-allele-${alleleIndex}`;

  return (
    <select
      id={labelId}
      aria-label={`${locus.id} allele ${alleleIndex + 1}`}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onFocus={() => onSelectLocus(locus.id)}
      className={`w-full min-h-[36px] text-xs rounded-md border bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-400 ${
        highlighted
          ? 'border-sky-400 dark:border-sky-600'
          : 'border-slate-300 dark:border-slate-600'
      }`}
    >
      {locus.alleles.map((allele) => (
        <option key={allele.code} value={allele.code}>
          {formatAlleleOptionLabel(allele)}
        </option>
      ))}
    </select>
  );
}

function ParentRabbitCard({ parentKey, title, subtitle, accentClass }: ParentRabbitCardProps) {
  const genotype = useGeneticStore((state) => state[parentKey]);
  const presetId = useGeneticStore((state) =>
    parentKey === 'parent1' ? state.parent1PresetId : state.parent2PresetId,
  );
  const selectedLocusId = useGeneticStore((state) => state.selectedLocusId);
  const setSelectedLocus = useGeneticStore((state) => state.setSelectedLocus);
  const setParentAllele = useGeneticStore((state) => state.setParentAllele);
  const loadParentPreset = useGeneticStore((state) => state.loadParentPreset);
  const clearParentPreset = useGeneticStore((state) => state.clearParentPreset);
  const resetParentToPreset = useGeneticStore((state) => state.resetParentToPreset);

  const loci = LOCI_ORDER.map((id) => RABBIT_GENETIC_MAP[id]).filter(Boolean);
  const phenotype = useMemo(() => resolveParentPhenotype(genotype), [genotype]);
  const activePreset = presetId ? PARENT_PRESETS.find((entry) => entry.id === presetId) : null;
  const varietyLabel = getVarietyDisplayLabel(presetId, genotype);
  const isModified = Boolean(activePreset && !genotypesEqual(genotype, activePreset.genotype));
  const selectValue = presetId ?? 'custom';

  const handlePresetChange = (value: string) => {
    if (value === 'custom') {
      clearParentPreset(parentKey);
      return;
    }

    const preset = PARENT_PRESETS.find((entry) => entry.id === value);
    if (preset) {
      loadParentPreset(parentKey, preset.id, preset.genotype);
    }
  };

  const handleResetToPreset = () => {
    if (activePreset) {
      resetParentToPreset(parentKey, activePreset.genotype);
    }
  };

  return (
    <article
      className={`rounded-xl border bg-white dark:bg-slate-900 shadow-sm overflow-hidden ${accentClass}`}
    >
      <header className="px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{subtitle}</p>
            <p
              className={`text-xs font-medium mt-1.5 truncate ${
                isModified
                  ? 'text-amber-700 dark:text-amber-400'
                  : presetId
                    ? 'text-slate-700 dark:text-slate-200'
                    : 'text-slate-500 dark:text-slate-400 italic'
              }`}
            >
              {varietyLabel}
            </p>
          </div>

          <div className="shrink-0 w-full sm:w-auto sm:min-w-[12rem]">
            <label
              htmlFor={`${parentKey}-preset`}
              className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1"
            >
              Variety preset
            </label>
            <select
              id={`${parentKey}-preset`}
              value={selectValue}
              onChange={(event) => handlePresetChange(event.target.value)}
              className="w-full text-[11px] rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              <option value="custom">Custom</option>
              {PARENT_PRESET_CATEGORIES.map((category) => (
                <optgroup key={category} label={category}>
                  {PARENT_PRESETS.filter((preset) => preset.category === category).map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {isModified && (
              <button
                type="button"
                onClick={handleResetToPreset}
                className="mt-1.5 text-[10px] text-sky-700 dark:text-sky-400 hover:underline focus:outline-none focus:ring-2 focus:ring-sky-400 rounded"
              >
                Reset to preset
              </button>
            )}
          </div>
        </div>

        <div className="mt-3 rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50/80 dark:bg-sky-950/30 px-3 py-2">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-400">
            Expected phenotype (draft)
          </div>
          <p className="text-xs text-slate-800 dark:text-slate-100 mt-1 leading-snug">{phenotype}</p>
        </div>
      </header>

      <div className="px-4 py-3">
        <div className="grid grid-cols-[2.5rem_1fr_1fr] gap-x-2 gap-y-2 items-center text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
          <span>Locus</span>
          <span>Allele 1</span>
          <span>Allele 2</span>
        </div>

        <div className="space-y-1.5">
          {loci.map((locus) => {
            const pair = genotype[locus.id] ?? ['?', '?'];
            const highlighted = selectedLocusId === locus.id;

            return (
              <div
                key={locus.id}
                className={`grid grid-cols-[2.5rem_1fr_1fr] gap-x-2 gap-y-1 items-center rounded-lg px-1 py-1 transition ${
                  highlighted ? 'bg-sky-50 dark:bg-sky-950/30' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedLocus(locus.id)}
                  className={`text-left font-mono text-xs font-bold rounded px-1 py-1 focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                    highlighted
                      ? 'text-sky-700 dark:text-sky-300'
                      : 'text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400'
                  }`}
                  title={`${locus.name} (${locus.geneSymbol})`}
                >
                  {locus.id}
                </button>

                <LocusAlleleSelect
                  locus={locus}
                  parentKey={parentKey}
                  alleleIndex={0}
                  value={pair[0]}
                  highlighted={highlighted}
                  onSelectLocus={setSelectedLocus}
                  onChange={(code) => setParentAllele(parentKey, locus.id, 0, code)}
                />

                <LocusAlleleSelect
                  locus={locus}
                  parentKey={parentKey}
                  alleleIndex={1}
                  value={pair[1]}
                  highlighted={highlighted}
                  onSelectLocus={setSelectedLocus}
                  onChange={(code) => setParentAllele(parentKey, locus.id, 1, code)}
                />

                <div className="col-span-3 text-[10px] font-mono text-slate-500 dark:text-slate-400 pl-1 -mt-0.5">
                  {locus.geneSymbol} · {pair[0]}/{pair[1]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}

export function ParentCrossPanel() {
  const swapParents = useGeneticStore((state) => state.swapParents);

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Breeding Cross</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Define each parent&apos;s full genotype in one place, then read offspring probabilities
          below.
        </p>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto_1fr] gap-4 items-start">
          <ParentRabbitCard
            parentKey="parent1"
            title="Parent A"
            subtitle="Dam — first parent in the cross"
            accentClass="border-rose-200 dark:border-rose-900/60"
          />

          <div
            className="hidden xl:flex flex-col items-center justify-center self-center gap-3 px-1"
            aria-hidden="true"
          >
            <span className="text-2xl font-light text-slate-400 dark:text-slate-500">×</span>
          </div>

          <ParentRabbitCard
            parentKey="parent2"
            title="Parent B"
            subtitle="Sire — second parent in the cross"
            accentClass="border-indigo-200 dark:border-indigo-900/60"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Presets load draft commercial genotypes. Tweak alleles per locus as needed.
          </p>
          <button
            type="button"
            onClick={swapParents}
            className="inline-flex items-center gap-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-900 transition focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden="true" />
            Swap parents
          </button>
        </div>
      </div>
    </section>
  );
}
