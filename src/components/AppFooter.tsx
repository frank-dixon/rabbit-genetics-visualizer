export type AppView = 'workspace' | 'about' | 'citations';

interface AppFooterProps {
  view: AppView;
  onNavigate: (view: AppView) => void;
}

const NAV_ITEMS: { id: AppView; label: string }[] = [
  { id: 'workspace', label: 'Predictor' },
  { id: 'about', label: 'How It Works' },
  { id: 'citations', label: 'Citations' },
];

export function AppFooter({ view, onNavigate }: AppFooterProps) {
  return (
    <footer className="shrink-0 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Meat rabbit coat &amp; eye cross calculator
        </p>

        <nav aria-label="Footer navigation" className="flex flex-wrap gap-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                view === item.id
                  ? 'bg-sky-100 dark:bg-sky-950/50 border-sky-400 dark:border-sky-600 text-sky-700 dark:text-sky-400 font-medium'
                  : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-sky-300 dark:hover:border-sky-600'
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
