import { useMemo, useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { PARENT_PRESET_CATEGORIES, PARENT_PRESETS } from '../data/meatRabbitBreeds';
import { WORKSPACE_MAX_WIDTH } from '../constants/layout';
import { GlossaryTermText } from './GlossaryTermText';
import { PhenotypeRenderer } from './PhenotypeRenderer';

interface BreedLibraryPageProps {
  onBack: () => void;
}

export function BreedLibraryPage({ onBack }: BreedLibraryPageProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | 'all'>('all');

  const breeds = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return PARENT_PRESETS.filter((preset) => {
      if (category !== 'all' && preset.category !== category) return false;
      if (!normalized) return true;
      return (
        preset.label.toLowerCase().includes(normalized) ||
        preset.category.toLowerCase().includes(normalized) ||
        preset.summary.toLowerCase().includes(normalized)
      );
    });
  }, [query, category]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof breeds>();
    for (const preset of breeds) {
      const list = map.get(preset.category) ?? [];
      list.push(preset);
      map.set(preset.category, list);
    }
    return [...map.entries()];
  }, [breeds]);

  return (
    <main className="flex-1 min-h-0 overflow-y-auto">
      <div className={`${WORKSPACE_MAX_WIDTH} mx-auto p-4 pb-10 space-y-5`}>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-sky-700 dark:text-sky-400 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to workspace
        </button>

        <header className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Breed library</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
            Meat-rabbit variety presets with draft genotype scaffolds. Use these as starting points in
            the predictor — verify against your lines before breeding decisions.
          </p>
        </header>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search breeds…"
              className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <option value="all">All categories</option>
            {PARENT_PRESET_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          {breeds.length} variety{breeds.length === 1 ? '' : 'ies'}
        </p>

        {grouped.length === 0 && (
          <p className="text-sm text-center text-slate-500 dark:text-slate-400 py-12">
            No breeds match your search.
          </p>
        )}

        {grouped.map(([groupCategory, presets]) => (
          <section key={groupCategory} className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {groupCategory}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {presets.map((preset) => (
                <article
                  key={preset.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 flex gap-3 shadow-sm"
                >
                  <PhenotypeRenderer
                    genotype={preset.genotype}
                    size="sm"
                    className="shrink-0"
                  />
                  <div className="min-w-0 space-y-1">
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">
                      {preset.label}
                    </h3>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug line-clamp-3">
                      <GlossaryTermText text={preset.summary} />
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
