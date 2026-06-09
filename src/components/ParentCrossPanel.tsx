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
  const genotype = useGeneticStore((state) => state[parentKey]);
  const setParentAllele = useGeneticStore((state) => state.setParentAllele);
  const loci = LOCI_ORDER.map((id) => RABBIT_GENETIC_MAP[id]).filter(Boolean);

  return (
    <div className="space-y-1.5 pt-1">
      <div className="space-y-1.5">
        {loci.map((locus) => {
          const pair = genotype[locus.id] ?? ['?', '?'];
          const differs = mateGenotype ? lociDiffer(genotype, mateGenotype, locus.id) : false;

          return (
            <div
              key={locus.id}
              className={`grid grid-cols-[2rem_1fr_1fr] gap-1.5 items-center rounded-md px-1 -mx-1 ${
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
