export type WorkspaceMobileTab = 'parents' | 'outcomes' | 'reference';

interface WorkspaceMobileTabsProps {
  activeTab: WorkspaceMobileTab;
  onChange: (tab: WorkspaceMobileTab) => void;
}

const TABS: { id: WorkspaceMobileTab; label: string }[] = [
  { id: 'parents', label: 'Parents' },
  { id: 'outcomes', label: 'Outcomes' },
  { id: 'reference', label: 'Reference' },
];

export function WorkspaceMobileTabs({ activeTab, onChange }: WorkspaceMobileTabsProps) {
  return (
    <div className="md:hidden sticky top-[3.75rem] z-40 -mx-3 sm:-mx-4 px-3 sm:px-4 py-2 bg-paper/90 dark:bg-espresso/90 backdrop-blur border-b border-rule/70 dark:border-rule-dark/60">
      <div className="flex gap-1 rounded-full border border-rule dark:border-rule-dark bg-paper-soft/90 dark:bg-paper-2/85 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex-1 text-xs font-semibold rounded-full px-2 py-2 transition ${
              activeTab === tab.id
                ? 'bg-teal text-teal-on shadow-teal'
                : 'text-ink-soft dark:text-slate-300 hover:bg-paper-2/80 dark:hover:bg-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
