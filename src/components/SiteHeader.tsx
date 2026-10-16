import type { AppView } from './AppFooter';
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
    <div className="sticky top-0 z-[60] shrink-0" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <header className="border-b border-rule bg-paper">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-6 px-4 sm:h-[60px] sm:px-9">
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className="kicker text-left text-[13px] text-ink"
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
                className={`kicker pb-1 ${
                  view === item.id ? 'border-b-2 border-ink text-ink' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
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
