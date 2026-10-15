import type { AppView } from './AppFooter';
import { ContentModeToggle } from './ContentModeToggle';
import { ThemeToggle } from './ThemeToggle';
import { AccountButton, GuestBanner } from './AccountNotice';

const NAV: { id: AppView; label: string }[] = [
  { id: 'workspace', label: 'Predict' },
  { id: 'learn', label: 'Learn' },
  { id: 'about', label: 'How it works' },
  { id: 'citations', label: 'Citations' },
];

interface SiteHeaderProps {
  view: AppView;
  onNavigate: (view: AppView) => void;
}

export function SiteHeader({ view, onNavigate }: SiteHeaderProps) {
  return (
    <div className="sticky top-0 z-[60] shrink-0">
      <header className="border-b border-rule bg-paper">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-6 px-4 sm:h-[60px] sm:px-9">
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className="kicker text-[13px] text-ink"
          >
            Progeny
          </button>
          <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-current={view === item.id ? 'page' : undefined}
                className={`kicker pb-1 ${
                  view === item.id ? 'border-b-2 border-ink text-ink' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <ContentModeToggle />
            <span className="hidden sm:block">
              <ThemeToggle />
            </span>
            <span className="hidden sm:block">
              <AccountButton />
            </span>
            <span className="sm:hidden">
              <AccountButton compact />
            </span>
          </div>
        </div>
        <nav aria-label="Main mobile" className="flex border-t border-rule md:hidden">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={view === item.id ? 'page' : undefined}
              className={`kicker flex-1 py-2.5 text-[10px] ${
                view === item.id ? 'bg-[var(--forest)] text-[var(--mist)]' : 'text-ink-muted'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>
      <GuestBanner />
    </div>
  );
}
