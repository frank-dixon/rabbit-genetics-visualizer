import { useMemo, useState } from 'react';
import { calculateCross, formatProbability, type ProgenyOutcome } from '../utils/geneticEngine';
import { useGeneticStore } from '../store/useGeneticStore';
import { GenotypeInline } from './GenotypeInline';
import { PhenotypeRenderer } from './PhenotypeRenderer';

const INITIAL_VISIBLE_GROUPS = 5;

type GenotypeMap = Record<string, [string, string]>;

interface PhenotypeVariant {
  outcome: ProgenyOutcome;
  baseline: GenotypeMap | undefined;
}

interface PhenotypeGroup {
  phenotype: string;
  title: string;
  subtitle?: string;
  combinedProbability: number;
  variants: PhenotypeVariant[];
}

function splitPhenotypeLabel(phenotype: string): { title: string; subtitle?: string } {
  const parts = phenotype.split(';').map((part) => part.trim()).filter(Boolean);
  if (parts.length <= 1) {
    return { title: phenotype };
  }
  return { title: parts[0], subtitle: parts.slice(1).join(' · ') };
}

function buildPhenotypeGroups(outcomes: ProgenyOutcome[]): PhenotypeGroup[] {
  const grouped = new Map<string, ProgenyOutcome[]>();

  for (const outcome of outcomes) {
    const existing = grouped.get(outcome.phenotype) ?? [];
    existing.push(outcome);
    grouped.set(outcome.phenotype, existing);
  }

  return [...grouped.entries()]
    .map(([phenotype, variants]) => {
      const sorted = [...variants].sort((a, b) => b.probability - a.probability);
      const baseline = sorted[0]?.genotypeByLocus;
      const { title, subtitle } = splitPhenotypeLabel(phenotype);

      return {
        phenotype,
        title,
        subtitle,
        combinedProbability: sorted.reduce((sum, item) => sum + item.probability, 0),
        variants: sorted.map((outcome, index) => ({
          outcome,
          baseline: index === 0 ? undefined : baseline,
        })),
      };
    })
    .sort((a, b) => b.combinedProbability - a.combinedProbability);
}

function variantQualifier(count: number): string {
  if (count === 1) return '1 genotype';
  return `${count} genotype variants`;
}

export function ProgenyOutcomesPanel() {
  const parent1 = useGeneticStore((state) => state.parent1);
  const parent2 = useGeneticStore((state) => state.parent2);
  const [showAll, setShowAll] = useState(false);

  const outcomes = useMemo(() => calculateCross(parent1, parent2), [parent1, parent2]);
  const groups = useMemo(() => buildPhenotypeGroups(outcomes), [outcomes]);
  const probabilitySum = outcomes.reduce((sum, outcome) => sum + outcome.probability, 0);
  const visibleGroups = showAll ? groups : groups.slice(0, INITIAL_VISIBLE_GROUPS);
  const hiddenGroupCount = Math.max(0, groups.length - INITIAL_VISIBLE_GROUPS);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Progeny outcomes</h3>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0">
          {groups.length} phenotypes · {outcomes.length} genotypes · {formatProbability(probabilitySum)}
        </span>
      </div>

      <div className="rounded-lg border border-slate-200 dark:border-slate-800 max-h-[min(55vh,400px)] overflow-y-auto overscroll-contain bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
        {visibleGroups.map((group) => {
          const headerGenotype = group.variants[0]?.outcome.genotypeByLocus;

          return (
            <section key={group.phenotype}>
              <div className="flex items-start gap-2.5 px-3 py-2.5 bg-slate-50/90 dark:bg-slate-950/60 border-b border-slate-200/80 dark:border-slate-800/80">
                {headerGenotype && (
                  <PhenotypeRenderer genotype={headerGenotype} size="sm" className="shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">
                        {group.title}
                      </h4>
                      {group.subtitle && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                          {group.subtitle}
                        </p>
                      )}
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        {variantQualifier(group.variants.length)}
                      </p>
                    </div>
                    <span className="text-base font-bold font-mono text-sky-700 dark:text-sky-400 tabular-nums shrink-0">
                      {formatProbability(group.combinedProbability)}
                    </span>
                  </div>
                </div>
              </div>

              {group.variants.length > 1 && (
                <ul className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {group.variants.map(({ outcome, baseline }) => {
                    const key = `${outcome.genotype}-${outcome.phenotype}`;

                    return (
                      <li
                        key={key}
                        className="flex items-start gap-2.5 pl-5 pr-3 py-2"
                      >
                        <span className="w-11 shrink-0 text-xs font-bold font-mono text-slate-600 dark:text-slate-300 tabular-nums pt-0.5">
                          {formatProbability(outcome.probability)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <GenotypeInline
                            genotype={outcome.genotypeByLocus}
                            baseline={baseline}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              {group.variants.length === 1 && (
                <div className="px-3 pb-2.5 pl-5">
                  <GenotypeInline genotype={group.variants[0].outcome.genotypeByLocus} />
                </div>
              )}
            </section>
          );
        })}
      </div>

      {hiddenGroupCount > 0 && !showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-2 text-xs text-sky-700 dark:text-sky-400 hover:underline min-h-[44px]"
        >
          Show {hiddenGroupCount} more phenotype{hiddenGroupCount === 1 ? '' : 's'}
        </button>
      )}

      {showAll && hiddenGroupCount > 0 && (
        <button
          type="button"
          onClick={() => setShowAll(false)}
          className="mt-2 text-xs text-slate-500 dark:text-slate-400 hover:underline min-h-[44px]"
        >
          Show fewer
        </button>
      )}
    </div>
  );
}
