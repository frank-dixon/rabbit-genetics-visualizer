import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { calculateCross, formatProbability, type ProgenyOutcome } from '../utils/geneticEngine';
import { resolvePlainEnglishPhenotype } from '../utils/plainEnglishPhenotype';
import { formatCompactGenotype } from '../utils/formatGenotype';
import { useGeneticStore } from '../store/useGeneticStore';
import { CopyTextButton } from './CopyTextButton';
import { GenotypeInline } from './GenotypeInline';
import { GlossaryTermText } from './GlossaryTermText';
import { PhenotypeRenderer } from './PhenotypeRenderer';
import { ProbabilityBar } from './ProbabilityBar';

const INITIAL_VISIBLE_GROUPS = 8;
const RARE_THRESHOLD = 0.05;

type GenotypeMap = Record<string, [string, string]>;

interface PhenotypeVariant {
  outcome: ProgenyOutcome;
  baseline: GenotypeMap | undefined;
}

interface PhenotypeGroup {
  phenotype: string;
  title: string;
  subtitle?: string;
  plainEnglish: string;
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
      const plainEnglish = baseline ? resolvePlainEnglishPhenotype(baseline) : '';

      return {
        phenotype,
        title,
        subtitle,
        plainEnglish,
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

function isSilveredGroup(group: PhenotypeGroup): boolean {
  const text = `${group.phenotype} ${group.title} ${group.subtitle ?? ''}`.toLowerCase();
  if (text.includes('silver')) return true;

  return group.variants.some(({ outcome }) => {
    const si = outcome.genotypeByLocus.Si;
    return si !== undefined && (si[0] === 'si' || si[1] === 'si');
  });
}

function matchesSearch(group: PhenotypeGroup, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  const haystack = [
    group.phenotype,
    group.title,
    group.subtitle ?? '',
    group.plainEnglish,
    ...group.variants.map(({ outcome }) => outcome.genotype),
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(normalized);
}

export function ProgenyOutcomesPanel() {
  const parent1 = useGeneticStore((state) => state.parent1);
  const parent2 = useGeneticStore((state) => state.parent2);
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [silveredOnly, setSilveredOnly] = useState(false);
  const [hideRare, setHideRare] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const outcomes = useMemo(() => calculateCross(parent1, parent2), [parent1, parent2]);
  const groups = useMemo(() => buildPhenotypeGroups(outcomes), [outcomes]);

  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      if (hideRare && group.combinedProbability < RARE_THRESHOLD) return false;
      if (silveredOnly && !isSilveredGroup(group)) return false;
      if (!matchesSearch(group, searchQuery)) return false;
      return true;
    });
  }, [groups, hideRare, silveredOnly, searchQuery]);

  const probabilitySum = filteredGroups.reduce(
    (sum, group) => sum + group.combinedProbability,
    0,
  );
  const visibleGroups = showAll ? filteredGroups : filteredGroups.slice(0, INITIAL_VISIBLE_GROUPS);
  const hiddenGroupCount = Math.max(0, filteredGroups.length - INITIAL_VISIBLE_GROUPS);
  const maxGroupProbability = useMemo(
    () => Math.max(...filteredGroups.map((group) => group.combinedProbability), 0),
    [filteredGroups],
  );

  const toggleGroup = (phenotype: string) => {
    setCollapsedGroups((current) => {
      const next = new Set(current);
      if (next.has(phenotype)) {
        next.delete(phenotype);
      } else {
        next.add(phenotype);
      }
      return next;
    });
  };

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Progeny outcomes</h3>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0">
          {filteredGroups.length}/{groups.length} phenotypes · {formatProbability(probabilitySum)}{' '}
          shown
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-2">
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Filter phenotypes…"
          className="flex-1 min-w-[10rem] text-xs rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
        <label className="inline-flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={silveredOnly}
            onChange={(event) => setSilveredOnly(event.target.checked)}
            className="rounded border-slate-300 dark:border-slate-600"
          />
          Silvered only
        </label>
        <label className="inline-flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={hideRare}
            onChange={(event) => setHideRare(event.target.checked)}
            className="rounded border-slate-300 dark:border-slate-600"
          />
          Hide &lt;5%
        </label>
      </div>

      <div className="rounded-lg border border-slate-200 dark:border-slate-800 max-h-[min(55vh,400px)] overflow-y-auto overscroll-contain bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
        {visibleGroups.length === 0 && (
          <p className="px-3 py-6 text-xs text-center text-slate-500 dark:text-slate-400">
            No outcomes match the current filters.
          </p>
        )}

        {visibleGroups.map((group) => {
          const headerGenotype = group.variants[0]?.outcome.genotypeByLocus;
          const isCollapsed = collapsedGroups.has(group.phenotype);
          const canCollapse = group.variants.length > 0;

          return (
            <section key={group.phenotype}>
              <button
                type="button"
                onClick={() => canCollapse && toggleGroup(group.phenotype)}
                className={`w-full flex items-start gap-2.5 px-3 py-2.5 bg-slate-50/90 dark:bg-slate-950/60 border-b border-slate-200/80 dark:border-slate-800/80 text-left ${
                  canCollapse ? 'hover:bg-slate-100/90 dark:hover:bg-slate-900/60' : ''
                }`}
              >
                {canCollapse && (
                  <ChevronDown
                    className={`h-3.5 w-3.5 mt-1 shrink-0 text-slate-500 transition-transform ${
                      isCollapsed ? '-rotate-90' : ''
                    }`}
                    aria-hidden="true"
                  />
                )}

                {headerGenotype && (
                  <PhenotypeRenderer genotype={headerGenotype} size="sm" className="shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">
                        <GlossaryTermText text={group.title} />
                      </h4>
                      {group.plainEnglish && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug italic">
                          {group.plainEnglish}
                        </p>
                      )}
                      {group.subtitle && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                          <GlossaryTermText text={group.subtitle} />
                        </p>
                      )}
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        {variantQualifier(group.variants.length)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0 w-20">
                      <span className="text-base font-bold font-mono text-sky-700 dark:text-sky-400 tabular-nums">
                        {formatProbability(group.combinedProbability)}
                      </span>
                      <ProbabilityBar
                        value={group.combinedProbability}
                        max={maxGroupProbability || 1}
                      />
                    </div>
                  </div>
                </div>
              </button>

              {!isCollapsed && group.variants.length > 1 && (
                <ul className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {group.variants.map(({ outcome, baseline }) => {
                    const key = `${outcome.genotype}-${outcome.phenotype}`;
                    const compactGenotype = formatCompactGenotype(outcome.genotypeByLocus);

                    return (
                      <li key={key} className="flex items-start gap-2.5 pl-3 pr-3 py-2">
                        <PhenotypeRenderer
                          genotype={outcome.genotypeByLocus}
                          size="sm"
                          className="shrink-0 w-16"
                        />
                        <div className="w-16 shrink-0 flex flex-col items-end gap-1 pt-0.5">
                          <span className="text-xs font-bold font-mono text-slate-600 dark:text-slate-300 tabular-nums">
                            {formatProbability(outcome.probability)}
                          </span>
                          <ProbabilityBar
                            value={outcome.probability}
                            max={group.combinedProbability || 1}
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <GenotypeInline
                            genotype={outcome.genotypeByLocus}
                            baseline={baseline}
                          />
                          <CopyTextButton text={compactGenotype} label="Copy genotype" />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              {!isCollapsed && group.variants.length === 1 && (
                <div className="px-3 pb-2.5 pl-8 space-y-1">
                  <GenotypeInline genotype={group.variants[0].outcome.genotypeByLocus} />
                  <CopyTextButton
                    text={formatCompactGenotype(group.variants[0].outcome.genotypeByLocus)}
                    label="Copy genotype"
                  />
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
