import { BookOpen, FlaskConical } from 'lucide-react';
import { useContentMode } from '../store/useContentModeStore';

export function ContentModeToggle() {
  const { mode, setMode, isNerd } = useContentMode();

  return (
    <div
      className="inline-flex items-center rounded-full border border-rule dark:border-rule-dark bg-paper-soft/90 dark:bg-paper-2/90 p-0.5 shadow-paper-sm"
      role="group"
      aria-label="Content detail"
    >
      <button
        type="button"
        onClick={() => setMode('simple')}
        aria-pressed={!isNerd}
        aria-label="Simple explanations"
        title="Simple — plain-English phenotypes"
        className={`relative flex h-7 items-center gap-1 rounded-full px-2.5 text-[11px] font-semibold transition-all duration-200 ${
          !isNerd
            ? 'bg-teal text-teal-on shadow-sm'
            : 'text-ink-muted hover:text-ink'
        }`}
      >
        <BookOpen className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />
        Simple
      </button>

      <button
        type="button"
        onClick={() => setMode('nerd')}
        aria-pressed={isNerd}
        aria-label="Nerd gene detail"
        title="Nerd — full locus and allele detail"
        className={`relative flex h-7 items-center gap-1 rounded-full px-2.5 text-[11px] font-semibold transition-all duration-200 ${
          isNerd
            ? 'bg-teal text-teal-on shadow-sm'
            : 'text-ink-muted hover:text-ink'
        }`}
      >
        <FlaskConical className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />
        Nerd
      </button>

      <span className="sr-only">Current content mode: {mode}</span>
    </div>
  );
}
