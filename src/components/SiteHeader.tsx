import type { AppView } from './AppFooter';
import { ContentModeToggle } from './ContentModeToggle';
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
    <div
      className="sticky top-0 z-[60] shrink-0 px-2 pt-2 sm:px-3 sm:pt-3"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.5rem)' }}
    >
      <header className="nav-float mx-auto max-w-6xl">
        <div className="flex h-12 items-center gap-6 px-4">
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className="kicker text-left text-[12px] font-bold text-ink"
          >
            Progeny
            <span className="kicker mt-0.5 block whitespace-nowrap text-left text-[9px] tracking-[0.1em] text-teal-deep md:hidden">
              Free · saved here
            </span>
          </button>
          <nav aria-label="Main desktop" className="hidden items-center gap-7 md:flex">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-current={view === item.id ? 'page' : undefined}
                className={`kicker ${
                  view === item.id ? 'text-ink' : 'text-[var(--link)] hover:text-ink'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <ContentModeToggle />
            <span className="hidden sm:block">
              <AccountButton />
            </span>
            <span className="sm:hidden">
              <AccountButton compact />
            </span>
          </div>
        </div>
      </header>
      <div className="hidden md:block">
        <GuestBanner />
      </div>
    </div>
  );
}
