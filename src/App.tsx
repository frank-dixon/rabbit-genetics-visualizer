import { useState } from 'react';
import { AboutPage } from './components/AboutPage';
import { MendelianLearnPage } from './components/MendelianLearnPage';
import { AppFooter, type AppView } from './components/AppFooter';
import { CrossWorkspace } from './components/CrossWorkspace';
import { GeneticsReferencePanel } from './components/GeneticsReferencePanel';
import { CrossHydrator } from './components/CrossHydrator';
import { GlossaryPanel } from './components/GlossaryPanel';
import { CitationsPage } from './components/CitationsPage';
import { SiteHeader } from './components/SiteHeader';
import { LandingPage } from './components/LandingPage';
import { LitterSummary } from './components/LitterSummary';
import { type WorkspaceMobileTab } from './components/WorkspaceMobileTabs';
import { MobileTabBar, type MobileDestination } from './components/MobileTabBar';
import { WORKSPACE_MAX_WIDTH } from './constants/layout';
import { useThemeStore } from './store/useThemeStore';

function WorkspaceView({ mobileTab }: { mobileTab: WorkspaceMobileTab }) {

  return (
    <main className="flex-1 w-full">
      <section className="relative mx-auto hidden max-w-[1440px] px-4 pt-6 sm:px-9 sm:pt-10 md:block">
        <p className="kicker text-ink-muted">Pairing · the cover cross</p>
        <h1 className="headline mt-2 text-[clamp(3.5rem,10vw,9.5rem)] text-ink">Buck × Doe</h1>
      </section>
      <div className="relative md:mt-4">
        <div className="absolute inset-x-0 top-24 bottom-0 hidden bg-[var(--forest)] md:block" aria-hidden />
        <div className={`relative w-full mx-auto px-0 md:px-9 ${WORKSPACE_MAX_WIDTH} space-y-3 pb-8`}>

      <div className="hidden md:block">
        <CrossWorkspace section="all" />
      </div>

      <div className={mobileTab === 'parents' ? 'block md:hidden' : 'hidden'}>
        <CrossWorkspace section="parents" />
      </div>

      <div className={mobileTab === 'outcomes' ? 'block md:hidden space-y-3' : 'hidden'}>
        <div className="bg-paper"><LitterSummary /></div>
        <CrossWorkspace section="outcomes" />
      </div>

      <div
        className={`space-y-3 px-4 pt-4 md:px-0 md:pt-0 ${mobileTab === 'reference' ? 'block' : 'hidden md:block'}`}
      >
        <GeneticsReferencePanel />
        <GlossaryPanel />
      </div>
        </div>
      </div>
      <div className="mx-auto hidden max-w-[1440px] pb-10 md:block">
        <LitterSummary />
      </div>
    </main>
  );
}

const ONBOARDED_KEY = 'progeny:onboarded';

export default function App() {
  const theme = useThemeStore((state) => state.theme);
  const [view, setViewState] = useState<AppView>(() =>
    localStorage.getItem(ONBOARDED_KEY) ? 'workspace' : 'landing',
  );
  const setView = (next: AppView) => {
    setViewState(next);
    window.scrollTo({ top: 0 });
  };
  const [mobileTab, setMobileTab] = useState<WorkspaceMobileTab>('parents');
  const go = (to: MobileDestination) => {
    if (to.tab) setMobileTab(to.tab);
    if (to.view === 'workspace') localStorage.setItem(ONBOARDED_KEY, '1');
    setView(to.view);
  };
  const startWorkspace = () => {
    localStorage.setItem(ONBOARDED_KEY, '1');
    setMobileTab('parents');
    setView('workspace');
  };

  return (
    <div
      data-theme={theme}
      className="min-h-screen pb-[calc(3.25rem+env(safe-area-inset-bottom))] md:pb-0 bg-transparent text-ink dark:text-ink flex flex-col font-sans transition-colors duration-200"
    >
      <SiteHeader view={view} onNavigate={setView} />

      {view === 'landing' && <LandingPage onStart={startWorkspace} />}
      {view === 'workspace' && (
        <>
          <CrossHydrator />
          <WorkspaceView mobileTab={mobileTab} />
        </>
      )}
      {view === 'learn' && <MendelianLearnPage onBack={() => setView('workspace')} />}
      {view === 'about' && <AboutPage onBack={() => setView('workspace')} />}
      {view === 'citations' && <CitationsPage onBack={() => setView('workspace')} />}

      <AppFooter view={view} onNavigate={setView} />
      <MobileTabBar view={view} tab={mobileTab} onGo={go} />
    </div>
  );
}
