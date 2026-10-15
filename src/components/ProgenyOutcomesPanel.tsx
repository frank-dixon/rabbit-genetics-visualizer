import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { calculateCross, formatProbability, type ProgenyOutcome } from '../utils/geneticEngine';
import { resolvePlainEnglishPhenotype } from '../utils/plainEnglishPhenotype';
import { formatCompactGenotype } from '../utils/formatGenotype';
import { useGeneticStore } from '../store/useGeneticStore';
import { useContentMode } from '../store/useContentModeStore';
import { resolveNerdPhenotypeBlurb } from '../utils/nerdPhenotype';
import { CopyTextButton } from './CopyTextButton';
import { GenotypeInline } from './GenotypeInline';
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
  const focusProgenyGenotype = useGeneticStore((state) => state.focusProgenyGenotype);
  const progenyFocusLabel = useGeneticStore((state) => state.progenyFocusLabel);
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [silveredOnly, setSilveredOnly] = useState(false);
  const [hideRare, setHideRare] = useState(false);
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
  const { isNerd } = useContentMode();

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
    setOpenGroups((current) => {
      const next = new Set(current);
      if (next.has(phenotype)) next.delete(phenotype);
      else next.add(phenotype);
      return next;
    });
  };

  const totalCombos = outcomes.length;
  const cols =
    'md:grid md:grid-cols-[6.5rem_4.5rem_minmax(0,1fr)_minmax(0,15rem)_8.5rem] md:items-center md:gap-4';

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-display text-lg font-bold text-ink">
          {groups.length} possible {groups.length === 1 ? 'look' : 'looks'}
          <span className="ml-2 hidden text-[11px] font-normal tracking-normal text-ink-muted sm:inline">
            from {totalCombos} genotype {totalCombos === 1 ? 'combination' : 'combinations'} · updates live
          </span>
        </h3>
        <span className="kicker hidden text-[10px] text-ink-muted sm:inline">
          {filteredGroups.length}/{groups.length} shown · {formatProbability(probabilitySum)}
        </span>
      </div>

      {progenyFocusLabel && (
        <p className="mb-2 text-[11px] text-teal">Chromosome focus: {progenyFocusLabel}</p>
      )}

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Filter looks or genes…"
          className="w-full min-w-[10rem] flex-1 sm:w-auto rounded border border-rule bg-[var(--glass)] px-3 py-2 text-xs text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-teal/60"
        />
        <label className="inline-flex cursor-pointer items-center gap-1.5 text-[11px] text-ink-soft">
          <input
            type="checkbox"
            checked={silveredOnly}
            onChange={(event) => setSilveredOnly(event.target.checked)}
            className="accent-[var(--teal)]"
          />
          Silvered only
        </label>
        <label className="inline-flex cursor-pointer items-center gap-1.5 text-[11px] text-ink-soft">
          <input
            type="checkbox"
            checked={hideRare}
            onChange={(event) => setHideRare(event.target.checked)}
            className="accent-[var(--teal)]"
          />
          Hide &lt;5%
        </label>
      </div>

      <div role="table" aria-label="Litter outcomes" className="glass overflow-hidden">
        <div
          role="row"
          className={`hidden border-b border-rule bg-[var(--glass)] px-4 py-2.5 kicker text-[10px] text-ink-muted ${cols}`}
        >
          <span role="columnheader">Odds</span>
          <span role="columnheader">Look</span>
          <span role="columnheader">Phenotype</span>
          <span role="columnheader">Genotype</span>
          <span role="columnheader" className="text-right">Variants</span>
        </div>

        {visibleGroups.length === 0 && (
          <p className="px-4 py-6 text-center text-xs text-ink-muted">No outcomes match the current filters.</p>
        )}

        {visibleGroups.map((group) => {
          const headerGenotype = group.variants[0]?.outcome.genotypeByLocus;
          const isOpen = openGroups.has(group.phenotype);
          const many = group.variants.length > 1;
          const focused = progenyFocusLabel === group.title;

          return (
            <div key={group.phenotype} role="rowgroup" className="border-b border-rule last:border-b-0">
              <div
                role="row"
                onClick={() => headerGenotype && focusProgenyGenotype(headerGenotype, group.title)}
                className={`grid cursor-pointer grid-cols-[4rem_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 px-4 py-3 hover:bg-[var(--glass)] ${cols} ${
                  focused ? 'bg-[var(--glass)] ring-1 ring-inset ring-teal/60' : ''
                }`}
              >
                <div role="cell" className="col-start-2 row-start-1 md:col-start-auto md:row-start-auto">
                  <span className="font-display text-xl font-bold tabular-nums text-teal">
                    {formatProbability(group.combinedProbability)}
                  </span>
                  <div className="mt-1 hidden md:block">
                    <ProbabilityBar value={group.combinedProbability} max={maxGroupProbability || 1} />
                  </div>
                </div>
                <div role="cell" className="col-start-1 row-span-2 row-start-1 md:col-start-auto md:row-start-auto md:row-span-1">
                  {headerGenotype && <PhenotypeRenderer genotype={headerGenotype} size="sm" />}
                </div>
                <div role="cell" className="col-span-2 col-start-2 row-start-2 min-w-0 md:col-start-auto md:row-start-auto md:col-span-1">
                  <p className="text-[13px] font-semibold leading-snug text-ink">{group.title}</p>
                  {group.subtitle && (
                    <p className={`mt-0.5 text-[11px] leading-snug text-ink-muted ${isNerd ? 'font-mono' : ''}`}>
                      {group.subtitle}
                    </p>
                  )}
                  {!isNerd && group.plainEnglish && (
                    <p className="mt-0.5 hidden text-[11px] leading-snug text-ink-muted md:block">{group.plainEnglish}</p>
                  )}
                  {isNerd && headerGenotype && (
                    <p className="mt-0.5 text-[11px] leading-snug text-ink-soft">
                      {resolveNerdPhenotypeBlurb(headerGenotype)}
                    </p>
                  )}
                </div>
                <div role="cell" className="hidden min-w-0 md:block">
                  {headerGenotype && (
                    <p className="truncate font-mono text-[11px] text-ink-soft" title={formatCompactGenotype(headerGenotype)}>
                      {formatCompactGenotype(headerGenotype)}
                    </p>
                  )}
                </div>
                <div role="cell" className="col-start-3 row-start-1 text-right md:col-start-auto md:row-start-auto">
                  {many ? (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleGroup(group.phenotype);
                      }}
                      aria-expanded={isOpen}
                      className="chip inline-flex items-center gap-1 text-[var(--link)] hover:text-ink"
                    >
                      {group.variants.length} variants
                      <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : '-rotate-90'}`} aria-hidden />
                    </button>
                  ) : (
                    <span className="text-[11px] text-ink-muted">1 genotype</span>
                  )}
                </div>
              </div>

              {isOpen && many && (
                <ul className="border-t border-rule bg-black/15">
                  {group.variants.map(({ outcome, baseline }) => {
                    const key = `${outcome.genotype}-${outcome.phenotype}`;
                    const compactGenotype = formatCompactGenotype(outcome.genotypeByLocus);
                    return (
                      <li
                        key={key}
                        onClick={() =>
                          focusProgenyGenotype(
                            outcome.genotypeByLocus,
                            `${group.title} (${formatProbability(outcome.probability)})`,
                          )
                        }
                        className="grid cursor-pointer grid-cols-[4rem_minmax(0,1fr)] items-center gap-3 px-4 py-2 hover:bg-[var(--glass)] md:grid-cols-[6.5rem_4.5rem_minmax(0,1fr)] md:gap-4"
                      >
                        <span className="font-mono text-xs font-bold tabular-nums text-ink-soft md:pl-3">
                          ↳ {formatProbability(outcome.probability)}
                        </span>
                        <span className="hidden md:block" />
                        <div className="min-w-0 space-y-1">
                          {isNerd ? (
                            <GenotypeInline genotype={outcome.genotypeByLocus} baseline={baseline} />
                          ) : (
                            <p className="break-words font-mono text-[11px] text-ink-soft">{compactGenotype}</p>
                          )}
                          {isNerd && (
                            <span onClick={(event) => event.stopPropagation()}>
                              <CopyTextButton text={compactGenotype} label="Copy genotype" />
                            </span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {hiddenGroupCount > 0 && (
        <button
          type="button"
          onClick={() => setShowAll((value) => !value)}
          className="mt-2 min-h-[44px] text-xs text-[var(--link)] hover:underline"
        >
          {showAll ? 'Show fewer' : `Show ${hiddenGroupCount} more look${hiddenGroupCount === 1 ? '' : 's'}`}
        </button>
      )}
    </div>
  );
}
