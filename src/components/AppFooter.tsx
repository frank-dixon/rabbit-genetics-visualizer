export type AppView = 'landing' | 'workspace' | 'learn' | 'about' | 'citations';

interface AppFooterProps {
  view: AppView;
  onNavigate: (view: AppView) => void;
}

const NAV_ITEMS: { id: AppView; label: string }[] = [
  { id: 'workspace', label: 'Predictor' },
  { id: 'about', label: 'How It Works' },
  { id: 'learn', label: 'Learn Genetics' },
  { id: 'citations', label: 'Citations' },
];

export function AppFooter({ view, onNavigate }: AppFooterProps) {
  return (
    <footer className="hidden md:block shrink-0 border-t border-rule">
      <div className="max-w-6xl mx-auto px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-xs text-ink-muted dark:text-slate-400">
          Progeny · Rabbit Progeny Predictor · Built by{' '}
          <a
            href="https://frank-dixon.github.io/"
            className="font-semibold text-teal underline-offset-2 hover:underline"
          >
            Frank Dixon
          </a>
        </p>

        <nav aria-label="Footer navigation" className="flex flex-wrap gap-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`text-xs px-3 py-1.5 border transition ${
                view === item.id
                  ? 'bg-teal text-teal-on border-teal font-semibold'
                  : 'bg-paper/70 dark:bg-paper-2/80 border-rule dark:border-rule-dark text-ink-soft dark:text-slate-300 hover:border-teal/50 dark:hover:border-teal/40'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </footer>
  );
}
