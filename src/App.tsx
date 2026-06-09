import { useState } from 'react';
import { AboutPage } from './components/AboutPage';
import { AppFooter, type AppView } from './components/AppFooter';
import { CrossWorkspace } from './components/CrossWorkspace';
import { GeneticsReferencePanel } from './components/GeneticsReferencePanel';
import { CrossHydrator } from './components/CrossHydrator';
import { GlossaryPanel } from './components/GlossaryPanel';
import { CitationsPage } from './components/CitationsPage';
import { ThemeToggle } from './components/ThemeToggle';
import {
  WorkspaceMobileTabs,
  type WorkspaceMobileTab,
} from './components/WorkspaceMobileTabs';
import { APP_NAME, APP_TAGLINE } from './constants/app';
import { WORKSPACE_MAX_WIDTH } from './constants/layout';
import { useThemeStore } from './store/useThemeStore';

function WorkspaceView() {
  const [mobileTab, setMobileTab] = useState<WorkspaceMobileTab>('parents');

  return (
    <main
      className={`flex-1 min-h-0 w-full mx-auto p-3 sm:p-4 ${WORKSPACE_MAX_WIDTH} space-y-4 lg:overflow-y-auto lg:overscroll-contain pb-6`}
    >
      <WorkspaceMobileTabs activeTab={mobileTab} onChange={setMobileTab} />

      <div className="hidden md:block">
        <CrossWorkspace section="all" />
      </div>

      <div className={mobileTab === 'parents' ? 'block md:hidden' : 'hidden'}>
        <CrossWorkspace section="parents" />
      </div>

      <div className={mobileTab === 'outcomes' ? 'block md:hidden' : 'hidden'}>
        <CrossWorkspace section="outcomes" />
      </div>

      <div
        className={`space-y-4 ${mobileTab === 'reference' ? 'block' : 'hidden md:block'}`}
      >
        <GeneticsReferencePanel />
        <GlossaryPanel />
      </div>
    </main>
  );
}

export default function App() {
  const theme = useThemeStore((state) => state.theme);
  const [view, setView] = useState<AppView>('workspace');

  return (
    <div
      data-theme={theme}
      className="min-h-screen lg:h-screen lg:overflow-hidden bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200"
    >
      <header className="shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-3 py-3 sm:p-4 sticky top-0 z-50 shadow-sm">
        <div className={`${WORKSPACE_MAX_WIDTH} mx-auto flex justify-between items-center gap-3`}>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-400 bg-clip-text text-transparent">
              {APP_NAME}
            </h1>
            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              {APP_TAGLINE}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {view === 'workspace' && (
        <>
          <CrossHydrator />
          <WorkspaceView />
        </>
      )}
      {view === 'about' && <AboutPage onBack={() => setView('workspace')} />}
      {view === 'citations' && <CitationsPage onBack={() => setView('workspace')} />}

      <AppFooter view={view} onNavigate={setView} />
    </div>
  );
}
