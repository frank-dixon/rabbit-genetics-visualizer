import { CollapsiblePanel } from './CollapsibleSection';
import { GLOSSARY_SECTIONS } from '../data/glossary';

export function GlossaryPanel() {
  return (
    <CollapsiblePanel
      title="Glossary"
      description="Genetics basics, coat patterns, eye colors, all eight loci, and terms used in this tool."
      defaultOpen={false}
    >
      <div className="space-y-6">
        {GLOSSARY_SECTIONS.map((section) => (
          <section key={section.id} aria-labelledby={`glossary-${section.id}`}>
            <h3
              id={`glossary-${section.id}`}
              className="text-sm font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-1.5"
            >
              {section.title}
            </h3>
            <dl className="mt-3 space-y-3">
              {section.entries.map((entry) => (
                <div key={entry.term}>
                  <dt className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {entry.term}
                  </dt>
                  <dd className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">
                    {entry.definition}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </CollapsiblePanel>
  );
}
