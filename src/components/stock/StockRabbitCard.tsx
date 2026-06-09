import { PARENT_PRESETS } from '../../data/meatRabbitBreeds';
import type { StockRabbit } from '../../types/stockRabbit';
import { averageConfidence } from '../../utils/stockGenotype';
import { resolveParentPhenotype } from '../../utils/geneticEngine';
import { CONFIDENCE_LABELS } from '../../types/stockRabbit';
import { PhenotypeRenderer } from '../PhenotypeRenderer';

interface StockRabbitCardProps {
  rabbit: StockRabbit;
  onDelete?: () => void;
}

export function StockRabbitCard({ rabbit, onDelete }: StockRabbitCardProps) {
  const phenotype = resolveParentPhenotype(rabbit.resolvedGenotype);
  const preset = rabbit.sourcePresetId
    ? PARENT_PRESETS.find((p) => p.id === rabbit.sourcePresetId)
    : null;
  const confidence = averageConfidence(rabbit.loci);

  return (
    <article className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 flex gap-3 shadow-sm">
      <PhenotypeRenderer genotype={rabbit.resolvedGenotype} size="sm" className="shrink-0" />
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
            {rabbit.name}
          </h3>
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="text-[10px] text-slate-400 hover:text-rose-600 shrink-0"
            >
              Remove
            </button>
          )}
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
          {rabbit.sex}
          {rabbit.earTag ? ` · ${rabbit.earTag}` : ''}
          {rabbit.dateOfBirth ? ` · ${rabbit.dateOfBirth}` : ''}
        </p>
        <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">{phenotype}</p>
        <p className="text-[10px] text-slate-400">
          {preset?.label ?? 'Custom'} · {CONFIDENCE_LABELS[confidence]} genetics
        </p>
      </div>
    </article>
  );
}
