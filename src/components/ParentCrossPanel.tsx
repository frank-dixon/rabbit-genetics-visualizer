import { useRef } from 'react';
import {
  LOCI_ORDER,
  RABBIT_GENETIC_MAP,
  type Allele,
  type Locus,
} from '../data/rabbitGenetics';
import { useGeneticStore } from '../store/useGeneticStore';
import { lociDiffer } from '../utils/parentGenotypeDiff';

type ParentKey = 'parent1' | 'parent2';
type GenotypeMap = Record<string, [string, string]>;

function formatAlleleOptionLabel(allele: Allele): string {
  return `${allele.code} — ${allele.name}`;
}

function locusEditorId(parentKey: ParentKey, locusId: string): string {
  return `locus-editor-${parentKey}-${locusId}`;
}

interface LocusAlleleSelectProps {
  locus: Locus;
  parentKey: ParentKey;
  alleleIndex: 0 | 1;
  value: string;
  onChange: (alleleCode: string) => void;
}

function LocusAlleleSelect({ locus, parentKey, alleleIndex, value, onChange }: LocusAlleleSelectProps) {
  return (
    <select
      aria-label={`${parentKey} ${locus.id} allele ${alleleIndex + 1}`}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full min-h-[40px] text-xs rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
    >
      {locus.alleles.map((allele) => (
        <option key={allele.code} value={allele.code}>
          {formatAlleleOptionLabel(allele)}
        </option>
      ))}
    </select>
  );
}

interface ParentGenotypeEditorProps {
  parentKey: ParentKey;
  mateGenotype?: GenotypeMap;
}

export function ParentGenotypeEditor({ parentKey, mateGenotype }: ParentGenotypeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const genotype = useGeneticStore((state) => state[parentKey]);
  const setParentAllele = useGeneticStore((state) => state.setParentAllele);
  const loci = LOCI_ORDER.map((id) => RABBIT_GENETIC_MAP[id]).filter(Boolean);

  const scrollToLocus = (locusId: string) => {
    const target = containerRef.current?.querySelector(`#${locusEditorId(parentKey, locusId)}`);
    target?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <div className="space-y-2 pt-1">
      <div className="flex flex-wrap gap-1 sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-950/95 py-1 -mx-1 px-1 backdrop-blur-sm">
        {LOCI_ORDER.map((locusId) => {
          const differs = mateGenotype ? lociDiffer(genotype, mateGenotype, locusId) : false;
          return (
            <button
              key={locusId}
              type="button"
              onClick={() => scrollToLocus(locusId)}
              className={`text-[10px] font-mono font-bold px-2 py-1 rounded border transition ${
                differs
                  ? 'border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40'
                  : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 hover:border-sky-400'
              }`}
            >
              {locusId}
            </button>
          );
        })}
      </div>

      <div ref={containerRef} className="space-y-1.5 max-h-64 overflow-y-auto overscroll-contain pr-1">
        {loci.map((locus) => {
          const pair = genotype[locus.id] ?? ['?', '?'];
          const differs = mateGenotype ? lociDiffer(genotype, mateGenotype, locus.id) : false;

          return (
            <div
              key={locus.id}
              id={locusEditorId(parentKey, locus.id)}
              className={`grid grid-cols-[2rem_1fr_1fr] gap-1.5 items-center rounded-md px-1 -mx-1 scroll-mt-12 ${
                differs ? 'bg-amber-50/80 dark:bg-amber-950/20' : ''
              }`}
            >
              <span
                className={`font-mono text-xs font-bold ${
                  differs
                    ? 'text-amber-700 dark:text-amber-300'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {locus.id}
              </span>
              <LocusAlleleSelect
                locus={locus}
                parentKey={parentKey}
                alleleIndex={0}
                value={pair[0]}
                onChange={(code) => setParentAllele(parentKey, locus.id, 0, code)}
              />
              <LocusAlleleSelect
                locus={locus}
                parentKey={parentKey}
                alleleIndex={1}
                value={pair[1]}
                onChange={(code) => setParentAllele(parentKey, locus.id, 1, code)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ParentCrossPanelProps {
  embedded?: boolean;
  editorOnly?: boolean;
}

export function ParentCrossPanel({ embedded = false, editorOnly = false }: ParentCrossPanelProps) {
  if (!editorOnly) {
    return null;
  }

  const content = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ParentGenotypeEditor parentKey="parent1" />
      <ParentGenotypeEditor parentKey="parent2" />
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden p-5">
      {content}
    </section>
  );
}
