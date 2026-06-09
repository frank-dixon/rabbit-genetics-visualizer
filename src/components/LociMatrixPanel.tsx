import type { Locus } from '../data/rabbitGenetics';
import { useCollapsibleLocusFocus } from '../hooks/useCollapsibleLocusFocus';
import { CollapsiblePanel, CollapsibleSection } from './CollapsibleSection';

interface LocusSelectorCardProps {
  locus: Locus;
  isSelected: boolean;
  onSelect: () => void;
}

function LocusSelectorCard({ locus, isSelected, onSelect }: LocusSelectorCardProps) {
  const [open, setOpen] = useCollapsibleLocusFocus(isSelected);

  return (
    <CollapsibleSection
      open={open}
      onOpenChange={setOpen}
      highlighted={isSelected}
      title={
        <div className="font-semibold text-sm text-sky-700 dark:text-sky-400">
          {locus.name}
          <span className="text-slate-400 dark:text-slate-500 font-normal"> ({locus.geneSymbol})</span>
        </div>
      }
      subtitle={
        locus.chromosome !== null
          ? `Chr ${locus.chromosome}${isSelected ? ' · focused on canvas' : ''}`
          : `${locus.geneSymbol} · unplaced`
      }
    >
      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
        {locus.chromosome !== null
          ? `Chromosome ${locus.chromosome}${locus.cytogeneticLocation ? ` • ${locus.cytogeneticLocation}` : ''}`
          : `${locus.geneSymbol} — chromosome unplaced in OryCun2.0`}
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400">{locus.meatRabbitRelevance}</p>
      <button
        type="button"
        onClick={onSelect}
        className={`w-full min-h-[44px] text-sm rounded-lg border transition ${
          isSelected
            ? 'border-sky-500 bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300'
            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-sky-300'
        }`}
      >
        {isSelected ? 'Focused on canvas — click to clear' : 'Focus this locus on canvas'}
      </button>
    </CollapsibleSection>
  );
}

interface LociMatrixPanelProps {
  loci: Locus[];
  selectedLocusId: string | null;
  onSelectLocus: (locusId: string | null) => void;
}

export function LociMatrixPanel({ loci, selectedLocusId, onSelectLocus }: LociMatrixPanelProps) {
  return (
    <CollapsiblePanel
      title="Loci Matrix Selectors"
      description="Expand a locus for details, then focus it on the 3D chromosome canvas."
      defaultOpen
    >
      {loci.map((locus) => (
        <LocusSelectorCard
          key={locus.id}
          locus={locus}
          isSelected={selectedLocusId === locus.id}
          onSelect={() => onSelectLocus(selectedLocusId === locus.id ? null : locus.id)}
        />
      ))}
    </CollapsiblePanel>
  );
}
