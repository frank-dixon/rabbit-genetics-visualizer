import { useState } from 'react';
import { AboutPage } from './components/AboutPage';
import { MendelianLearnPage } from './components/MendelianLearnPage';
import { AppFooter, type AppView } from './components/AppFooter';
import { CrossWorkspace } from './components/CrossWorkspace';
import { GeneticsReferencePanel } from './components/GeneticsReferencePanel';
import { CrossHydrator } from './components/CrossHydrator';
import { GlossaryPanel } from './components/GlossaryPanel';
import { CitationsPage } from './components/CitationsPage';
import { ContentModeToggle } from './components/ContentModeToggle';
import { ThemeToggle } from './components/ThemeToggle';
import { HubMasthead } from './components/HubMasthead';
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
      className={`flex-1 min-h-0 w-full mx-auto p-3 sm:p-4 ${WORKSPACE_MAX_WIDTH} space-y-3 lg:overflow-y-auto lg:overscroll-contain pb-6`}
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
        className={`space-y-3 ${mobileTab === 'reference' ? 'block' : 'hidden md:block'}`}
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
      className="min-h-screen lg:h-screen lg:overflow-hidden bg-transparent text-ink dark:text-ink flex flex-col font-sans transition-colors duration-200"
    >
      <HubMasthead />

      <header className="shrink-0 border-b border-rule/70 dark:border-rule-dark/70 bg-paper-soft/90 dark:bg-espresso/90 backdrop-blur-md px-3 py-2.5 sm:px-4 sticky top-[3rem] z-50">
        <div className={`${WORKSPACE_MAX_WIDTH} mx-auto flex justify-between items-center gap-3`}>
          <div className="min-w-0 flex items-start gap-2.5">
            <span
              aria-hidden="true"
              className="mt-0.5 hidden sm:block h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-teal via-teal-deep to-espresso shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]"
            />
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.1em] text-teal">
                Meat rabbit genetics
              </p>
              <h1 className="font-sans text-lg sm:text-xl font-semibold text-ink leading-tight">
                {APP_NAME}
              </h1>
              <p className="text-[11px] sm:text-xs text-ink-muted mt-0.5 truncate">
                {APP_TAGLINE}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ContentModeToggle />
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
      {view === 'learn' && <MendelianLearnPage onBack={() => setView('workspace')} />}
      {view === 'about' && <AboutPage onBack={() => setView('workspace')} />}
      {view === 'citations' && <CitationsPage onBack={() => setView('workspace')} />}

      <AppFooter view={view} onNavigate={setView} />
    </div>
  );
}
