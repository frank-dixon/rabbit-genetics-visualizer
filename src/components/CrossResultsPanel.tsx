import { useMemo } from 'react';
import { calculateCross, formatProbability } from '../utils/geneticEngine';
import { useGeneticStore } from '../store/useGeneticStore';
import { CollapsiblePanel } from './CollapsibleSection';

export function CrossResultsPanel() {
  const parent1 = useGeneticStore((state) => state.parent1);
  const parent2 = useGeneticStore((state) => state.parent2);

  const outcomes = useMemo(() => calculateCross(parent1, parent2), [parent1, parent2]);
  const probabilitySum = outcomes.reduce((sum, outcome) => sum + outcome.probability, 0);

  return (
    <CollapsiblePanel
      title="Cross Results"
      description="Mendelian outcomes from current parent genotypes. Epistasis rules are draft — verify before breeding."
      defaultOpen
    >
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-100 dark:bg-slate-950/80 text-slate-600 dark:text-slate-300">
            <tr>
              <th className="px-3 py-2 font-semibold">Phenotype</th>
              <th className="px-3 py-2 font-semibold">Genotype</th>
              <th className="px-3 py-2 font-semibold text-right">Probability</th>
            </tr>
          </thead>
          <tbody>
            {outcomes.map((outcome) => (
              <tr
                key={`${outcome.genotype}-${outcome.phenotype}`}
                className="border-t border-slate-200 dark:border-slate-800 odd:bg-white even:bg-slate-50/80 dark:odd:bg-slate-900 dark:even:bg-slate-950/40"
              >
                <td className="px-3 py-2.5 text-slate-800 dark:text-slate-100 align-top">
                  {outcome.phenotype}
                </td>
                <td className="px-3 py-2.5 font-mono text-slate-600 dark:text-slate-400 align-top">
                  {outcome.genotype}
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-sky-700 dark:text-sky-400 align-top whitespace-nowrap">
                  {formatProbability(outcome.probability)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-3 text-[11px] text-slate-500 dark:text-slate-400">
        <span>{outcomes.length} unique outcomes</span>
        <span>Total: {formatProbability(probabilitySum)}</span>
      </div>

      <p className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
        Draft engine — marked rules need Frank&apos;s biology review (especially C-locus incomplete
        dominance and epistasis order).
      </p>
    </CollapsiblePanel>
  );
}
