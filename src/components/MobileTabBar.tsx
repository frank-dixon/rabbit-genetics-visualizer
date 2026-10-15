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
      className="fixed inset-x-0 bottom-0 z-[70] flex border-t border-rule bg-paper md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {ITEMS.map((item) => {
        const active = view === item.to.view && (!item.to.tab || item.to.tab === tab);
        return (
          <button
            key={item.label}
            type="button"
            onClick={() => onGo(item.to)}
            aria-current={active ? 'page' : undefined}
            className={`kicker flex-1 py-3.5 text-[10px] ${
              active ? 'bg-[var(--forest)] text-[var(--mist)]' : 'text-ink-muted'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
