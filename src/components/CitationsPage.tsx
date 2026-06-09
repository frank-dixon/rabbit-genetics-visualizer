import { CITATIONS, CITATION_DISCLAIMER } from '../data/citations';
import { InfoPage } from './InfoPage';

interface CitationsPageProps {
  onBack: () => void;
}

const TOPIC_LABELS: Record<string, string> = {
  general: 'General / Overview',
  A: 'A locus (ASIP — pattern)',
  B: 'B locus (TYRP1 — black/chocolate)',
  C: 'C locus (TYR — color/albino)',
  D: 'D locus (MLPH — dilute)',
  E: 'E locus (MC1R — extension)',
  En: 'En locus (KIT — spotting)',
  V: 'V locus (Vienna — BEW)',
  'eye-color': 'Eye color',
  'meat-rabbit': 'Meat rabbit breeds',
};

export function CitationsPage({ onBack }: CitationsPageProps) {
  return (
    <InfoPage title="Citations & Sources" onBack={onBack}>
      <p>{CITATION_DISCLAIMER}</p>

      <p>
        Every locus, allele description, and eye-color rule in this app traces back to one or more
        of the references below. URLs open the primary source where available.
      </p>

      <ol className="list-none space-y-5 pl-0">
        {CITATIONS.map((citation, index) => (
          <li
            key={citation.id}
            id={citation.id}
            className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-900 shadow-sm"
          >
            <div className="text-xs font-mono text-slate-400 dark:text-slate-500 mb-1">
              [{index + 1}]
            </div>
            <p className="font-medium text-slate-800 dark:text-slate-100 m-0">
              {citation.authors} ({citation.year}).{' '}
              {citation.url ? (
                <a href={citation.url} target="_blank" rel="noopener noreferrer">
                  {citation.title}
                </a>
              ) : (
                citation.title
              )}
              {citation.publisher && (
                <span className="text-slate-600 dark:text-slate-400">. {citation.publisher}</span>
              )}
              .
            </p>
            {citation.notes && (
              <p className="text-slate-600 dark:text-slate-400 mt-2 mb-0">{citation.notes}</p>
            )}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {citation.topics.map((topic) => (
                <span
                  key={topic}
                  className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800"
                >
                  {TOPIC_LABELS[topic] ?? topic}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ol>

      <h2>Quick links</h2>
      <ul>
        <li>
          <a
            href="https://extension.oregonstate.edu/catalog/em-9708-rabbit-coat-color-genetics-summary-table"
            target="_blank"
            rel="noopener noreferrer"
          >
            OSU Extension — Rabbit Coat Color Genetics Summary (EM 9708)
          </a>
        </li>
        <li>
          <a href="https://www.omia.org/" target="_blank" rel="noopener noreferrer">
            OMIA — Online Mendelian Inheritance in Animals
          </a>
        </li>
      </ul>
    </InfoPage>
  );
}
