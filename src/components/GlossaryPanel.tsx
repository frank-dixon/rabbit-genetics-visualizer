import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { CollapsiblePanel } from './CollapsibleSection';
import {
  filterGlossarySections,
  GLOSSARY_OPEN_EVENT,
  glossaryEntryAnchor,
} from '../utils/glossaryNavigation';

export function GlossaryPanel() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const sections = filterGlossarySections(query);

  useEffect(() => {
    const handleOpenTerm = (event: Event) => {
      const customEvent = event as CustomEvent<{ anchorId: string }>;
      setOpen(true);
      setQuery('');

      window.requestAnimationFrame(() => {
        const target = document.getElementById(customEvent.detail.anchorId);
        target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target?.classList.add('glossary-term-highlight');
        window.setTimeout(() => {
          target?.classList.remove('glossary-term-highlight');
        }, 2000);
      });
    };

    window.addEventListener(GLOSSARY_OPEN_EVENT, handleOpenTerm);
    return () => window.removeEventListener(GLOSSARY_OPEN_EVENT, handleOpenTerm);
  }, []);

  return (
    <CollapsiblePanel
      title="Glossary"
      description="Genetics basics, coat patterns, eye colors, all eight loci, and terms used in this tool."
      open={open}
      onOpenChange={setOpen}
      defaultOpen={false}
    >
      <div className="flex items-center gap-2 px-1 pb-4 border-b border-slate-200 dark:border-slate-800">
        <Search className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search glossary…"
          className="w-full text-sm bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
        />
      </div>

      <div className="space-y-6 mt-4">
        {sections.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No glossary entries match &ldquo;{query}&rdquo;.
          </p>
        )}

        {sections.map((section) => (
          <section key={section.id} aria-labelledby={`glossary-${section.id}`}>
            <h3
              id={`glossary-${section.id}`}
              className="text-sm font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-1.5"
            >
              {section.title}
            </h3>
            <dl className="mt-3 space-y-3">
              {section.entries.map((entry) => {
                const anchorId = glossaryEntryAnchor(section.id, entry.term);
                return (
                  <div
                    key={entry.term}
                    id={anchorId}
                    className="scroll-mt-24 rounded-md transition-colors duration-500"
                  >
                    <dt className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {entry.term}
                    </dt>
                    <dd className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">
                      {entry.definition}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </section>
        ))}
      </div>
    </CollapsiblePanel>
  );
}
