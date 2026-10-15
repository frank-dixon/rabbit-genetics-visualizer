import type { AppView } from './AppFooter';
import type { WorkspaceMobileTab } from './WorkspaceMobileTabs';

export type MobileDestination = { view: AppView; tab?: WorkspaceMobileTab };

const ITEMS: { label: string; to: MobileDestination }[] = [
  { label: 'Cross', to: { view: 'workspace', tab: 'parents' } },
  { label: 'Glossary', to: { view: 'workspace', tab: 'reference' } },
  { label: 'Learn', to: { view: 'learn' } },
  { label: 'Sources', to: { view: 'citations' } },
];

interface MobileTabBarProps {
  view: AppView;
  tab: WorkspaceMobileTab;
  onGo: (to: MobileDestination) => void;
}

/** The only mobile navigation: fixed bottom bar, padded for the home indicator / Safari toolbar. */
export function MobileTabBar({ view, tab, onGo }: MobileTabBarProps) {
  return (
    <nav
      aria-label="Main"
      className="nav-float fixed inset-x-2 bottom-2 z-[70] flex overflow-hidden md:hidden"
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
    >
      {ITEMS.map((item) => {
        const active = view === item.to.view && (!item.to.tab || item.to.tab === tab);
        return (
          <button
            key={item.label}
            type="button"
            onClick={() => onGo(item.to)}
            aria-current={active ? 'page' : undefined}
            className={`kicker flex-1 py-3 text-[10px] ${
              active ? 'text-ink font-bold' : 'text-[var(--link)]'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
