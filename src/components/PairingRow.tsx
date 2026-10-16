import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { PARENT_PRESETS } from '../data/meatRabbitBreeds';
import { LOCI_ORDER } from '../data/rabbitGenetics';
import { getPresetBreedingNotes } from '../data/presetBreedingNotes';
import { genotypesEqual, useGeneticStore } from '../store/useGeneticStore';
import { formatCompactGenotype } from '../utils/formatGenotype';
import { resolveParentPhenotype } from '../utils/geneticEngine';
import { resolveNerdPhenotypeBlurb } from '../utils/nerdPhenotype';
import { resolvePlainEnglishPhenotype } from '../utils/plainEnglishPhenotype';
import { CopyTextButton } from './CopyTextButton';
import { GenotypeInline } from './GenotypeInline';
import { GlossaryTermText } from './GlossaryTermText';
import { ParentGenotypeEditor } from './ParentCrossPanel';
import { PhenotypeRenderer } from './PhenotypeRenderer';
import { PresetPicker } from './PresetPicker';

type ParentKey = 'parent1' | 'parent2';
type GenotypeMap = Record<string, [string, string]>;

function samePair(a?: [string, string], b?: [string, string]) {
  if (!a || !b) return a === b;
  return (a[0] === b[0] && a[1] === b[1]) || (a[0] === b[1] && a[1] === b[0]);
}

function locusChip(id: string, pair: [string, string]) {
  return pair[0] === pair[1] ? `${id} ${pair[0]}` : `${id} ${pair[0]}/${pair[1]}`;
}

interface ParentFieldProps {
  parentKey: ParentKey;
  role: 'Dam' | 'Sire';
  mate: GenotypeMap;
}

/** MorphMarket-style parent field: breed search, gene chips, full editor in a drawer. */
function ParentField({ parentKey, role, mate }: ParentFieldProps) {
  const genotype = useGeneticStore((state) => state[parentKey]);
  const presetId = useGeneticStore((state) =>
    parentKey === 'parent1' ? state.parent1PresetId : state.parent2PresetId,
  );
  const loadParentPreset = useGeneticStore((state) => state.loadParentPreset);
  const clearParentPreset = useGeneticStore((state) => state.clearParentPreset);
  const resetParentToPreset = useGeneticStore((state) => state.resetParentToPreset);
  const isNerd = false; // Simple/Nerd toggle removed; genetics live in disclosures
  const [open, setOpen] = useState(false);

  const phenotype = useMemo(() => resolveParentPhenotype(genotype), [genotype]);
  const plain = useMemo(() => resolvePlainEnglishPhenotype(genotype), [genotype]);
  const compact = useMemo(() => formatCompactGenotype(genotype), [genotype]);
  const notes = useMemo(() => getPresetBreedingNotes(presetId, genotype), [presetId, genotype]);
  const preset = presetId ? PARENT_PRESETS.find((entry) => entry.id === presetId) : null;
  const modified = Boolean(preset && !genotypesEqual(genotype, preset.genotype));
  const loci = LOCI_ORDER.filter((id) => genotype[id]);

  const onPreset = (next: string | null) => {
    if (!next) return clearParentPreset(parentKey);
    const found = PARENT_PRESETS.find((entry) => entry.id === next);
    if (found) loadParentPreset(parentKey, found.id, found.genotype);
  };

  return (
    <div className="min-w-0 space-y-2">
      <div className="flex items-center gap-2">
        <span className="tag-cta">{role}</span>
        <span className="truncate text-[12px] text-ink-soft">
          {modified ? `${preset?.label} — modified` : preset ? preset.label : 'Custom genotype'}
        </span>
      </div>
      <div className="flex items-start gap-3">
        <PhenotypeRenderer genotype={genotype} size="sm" className="shrink-0" />
        <div className="min-w-0 flex-1 space-y-2">
          <PresetPicker id={`${parentKey}-pairing-preset`} value={presetId} onChange={onPreset} />
          <p className="text-[12px] leading-snug text-ink">
            <GlossaryTermText text={phenotype.split(';')[0]} />
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5" aria-label={`${role} genes`}>
        {loci.map((id) => {
          const differs = !samePair(genotype[id], mate[id]);
          return (
            <span
              key={id}
              className={`chip ${differs ? 'chip-hot' : ''}`}
              title={differs ? 'Differs from the other parent' : undefined}
            >
              {locusChip(id, genotype[id])}
            </span>
          );
        })}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="chip inline-flex items-center gap-1 text-[var(--link)] hover:text-ink"
        >
          {open ? 'Close editor' : 'Edit genes'}
          <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
        </button>
      </div>
      {open && (
        <div className="glass space-y-3 p-3">
          <p className="text-[11px] leading-snug text-ink-muted">
            {isNerd ? resolveNerdPhenotypeBlurb(genotype) : plain}
          </p>
          <div className="flex items-start justify-between gap-2">
            <GenotypeInline genotype={genotype} baseline={mate} />
            <CopyTextButton text={compact} label="Copy" className="shrink-0" />
          </div>
          {modified && preset && (
            <button
              type="button"
              onClick={() => resetParentToPreset(parentKey, preset.genotype)}
              className="text-[11px] text-[var(--link)] hover:underline"
            >
              Reset to preset
            </button>
          )}
          {notes.length > 0 && (
            <ul className="list-disc space-y-1 pl-4 text-[11px] leading-relaxed text-ink-soft">
              {notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          )}
          <ParentGenotypeEditor parentKey={parentKey} mateGenotype={mate} />
        </div>
      )}
    </div>
  );
}

export function PairingRow() {
  const parent1 = useGeneticStore((state) => state.parent1);
  const parent2 = useGeneticStore((state) => state.parent2);
  return (
    <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-6">
      <ParentField parentKey="parent1" role="Dam" mate={parent2} />
      <div className="headline-solid hidden pt-10 text-3xl md:block" aria-hidden>
        ×
      </div>
      <ParentField parentKey="parent2" role="Sire" mate={parent1} />
    </div>
  );
}
