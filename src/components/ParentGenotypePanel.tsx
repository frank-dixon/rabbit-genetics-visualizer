import {
  CollapsiblePanel,
  CollapsibleSection,
} from './CollapsibleSection';
import { useCollapsibleLocusFocus } from '../hooks/useCollapsibleLocusFocus';
import { LOCI_ORDER, RABBIT_GENETIC_MAP, type Locus } from '../data/rabbitGenetics';
import { useGeneticStore } from '../store/useGeneticStore';

interface AlleleSelectProps {
  locus: Locus;
  parent: 'parent1' | 'parent2';
  alleleIndex: 0 | 1;
  value: string;
  onChange: (alleleCode: string) => void;
}

function AlleleSelect({ locus, parent, alleleIndex, value, onChange }: AlleleSelectProps) {
  const labelId = `${parent}-${locus.id}-allele-${alleleIndex}`;

  if (locus.alleles.length === 0) {
    return (
      <span className="text-xs text-slate-400 italic" id={labelId}>
        No alleles defined
      </span>
    );
  }

  return (
    <select
      id={labelId}
      aria-label={`${parent === 'parent1' ? 'Parent 1' : 'Parent 2'} ${locus.name} allele ${alleleIndex + 1}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full min-h-[44px] text-sm font-mono rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
    >
      {locus.alleles.map((allele) => (
        <option key={allele.code} value={allele.code}>
          {allele.symbol} ({allele.code}) — {allele.name}
        </option>
      ))}
    </select>
  );
}

interface ParentRowProps {
  label: string;
  locus: Locus;
  parent: 'parent1' | 'parent2';
  genotype: [string, string];
  setParentAllele: ReturnType<typeof useGeneticStore.getState>['setParentAllele'];
}

function ParentRow({ label, locus, parent, genotype, setParentAllele }: ParentRowProps) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">{label}</div>
      <div className="grid grid-cols-2 gap-2">
        <AlleleSelect
          locus={locus}
          parent={parent}
          alleleIndex={0}
          value={genotype[0]}
          onChange={(code) => setParentAllele(parent, locus.id, 0, code)}
        />
        <AlleleSelect
          locus={locus}
          parent={parent}
          alleleIndex={1}
          value={genotype[1]}
          onChange={(code) => setParentAllele(parent, locus.id, 1, code)}
        />
      </div>
      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
        Genotype: {genotype[0]} / {genotype[1]}
      </div>
    </div>
  );
}

interface LocusGenotypeGroupProps {
  locus: Locus;
  isFocused: boolean;
  p1Genotype: [string, string];
  p2Genotype: [string, string];
  setParentAllele: ReturnType<typeof useGeneticStore.getState>['setParentAllele'];
}

function LocusGenotypeGroup({
  locus,
  isFocused,
  p1Genotype,
  p2Genotype,
  setParentAllele,
}: LocusGenotypeGroupProps) {
  const [open, setOpen] = useCollapsibleLocusFocus(isFocused);

  return (
    <CollapsibleSection
      open={open}
      onOpenChange={setOpen}
      highlighted={isFocused}
      title={
        <div>
          <div className="font-semibold text-sm text-sky-700 dark:text-sky-400">
            {locus.id} — {locus.name}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">{locus.geneSymbol}</div>
        </div>
      }
      subtitle={`P1: ${p1Genotype[0]}/${p1Genotype[1]} · P2: ${p2Genotype[0]}/${p2Genotype[1]}`}
    >
      <ParentRow
        label="Parent 1"
        locus={locus}
        parent="parent1"
        genotype={p1Genotype}
        setParentAllele={setParentAllele}
      />

      <ParentRow
        label="Parent 2"
        locus={locus}
        parent="parent2"
        genotype={p2Genotype}
        setParentAllele={setParentAllele}
      />
    </CollapsibleSection>
  );
}

export function ParentGenotypePanel() {
  const selectedLocusId = useGeneticStore((state) => state.selectedLocusId);
  const parent1 = useGeneticStore((state) => state.parent1);
  const parent2 = useGeneticStore((state) => state.parent2);
  const setParentAllele = useGeneticStore((state) => state.setParentAllele);

  const loci = LOCI_ORDER.map((id) => RABBIT_GENETIC_MAP[id]).filter(Boolean);

  return (
    <CollapsiblePanel
      title="Parent Genotype Selectors"
      description="Set each parent's two alleles per locus. Cross results coming in the next branch."
      defaultOpen
    >
      {loci.map((locus) => (
        <LocusGenotypeGroup
          key={locus.id}
          locus={locus}
          isFocused={selectedLocusId === locus.id}
          p1Genotype={parent1[locus.id] ?? ['?', '?']}
          p2Genotype={parent2[locus.id] ?? ['?', '?']}
          setParentAllele={setParentAllele}
        />
      ))}
    </CollapsiblePanel>
  );
}
