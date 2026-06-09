export type WorkspaceMobileTab = 'parents' | 'outcomes' | 'reference';

interface WorkspaceMobileTabsProps {
  activeTab: WorkspaceMobileTab;
  onChange: (tab: WorkspaceMobileTab) => void;
  showReference?: boolean;
}

const TABS: { id: WorkspaceMobileTab; label: string }[] = [
  { id: 'parents', label: 'Parents' },
  { id: 'outcomes', label: 'Outcomes' },
  { id: 'reference', label: 'Reference' },
];

export function WorkspaceMobileTabs({
  activeTab,
  onChange,
  showReference = true,
}: WorkspaceMobileTabsProps) {
  const tabs = showReference ? TABS : TABS.filter((tab) => tab.id !== 'reference');

  return (
    <div className="md:hidden sticky top-[3.25rem] z-40 -mx-3 sm:-mx-4 px-3 sm:px-4 py-2 bg-slate-100/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="flex gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex-1 text-xs font-medium rounded-md px-2 py-2 transition ${
              activeTab === tab.id
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
