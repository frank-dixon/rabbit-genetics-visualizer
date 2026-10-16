import { useState } from 'react';
import { AboutPage } from './components/AboutPage';
import { MendelianLearnPage } from './components/MendelianLearnPage';
import { AppFooter, type AppView } from './components/AppFooter';
import { SplitWorkspace } from './components/SplitWorkspace';
import { LearnMoreModal } from './components/LearnMoreModal';
import { GeneticsReferencePanel } from './components/GeneticsReferencePanel';
import { CrossHydrator } from './components/CrossHydrator';
import { GlossaryPanel } from './components/GlossaryPanel';
import { CitationsPage } from './components/CitationsPage';
import { SiteHeader } from './components/SiteHeader';
import { LandingPage } from './components/LandingPage';
import { type WorkspaceMobileTab } from './components/WorkspaceMobileTabs';
import { MobileTabBar, type MobileDestination } from './components/MobileTabBar';
import { WORKSPACE_MAX_WIDTH } from './constants/layout';
import { useThemeStore } from './store/useThemeStore';

function WorkspaceView({
  mobileTab,
  onNavigate,
}: {
  mobileTab: WorkspaceMobileTab;
  onNavigate: (view: AppView) => void;
}) {
  const [learnOpen, setLearnOpen] = useState(false);
  const showReference = mobileTab === 'reference';
  return (
    <main className="w-full flex-1">
      <div className={showReference ? 'hidden md:block' : 'block'}>
        <SplitWorkspace onLearnMore={() => setLearnOpen(true)} />
      </div>
      <div
        className={`mx-auto w-full ${WORKSPACE_MAX_WIDTH} space-y-4 px-4 pb-10 pt-6 sm:px-9 ${showReference ? 'block' : 'hidden md:block'}`}
      >
        <GeneticsReferencePanel />
        <GlossaryPanel />
      </div>
      <LearnMoreModal
        open={learnOpen}
        onClose={() => setLearnOpen(false)}
        onOpenLearn={() => onNavigate('learn')}
        onOpenCitations={() => onNavigate('citations')}
      />
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
          <WorkspaceView mobileTab={mobileTab} onNavigate={setView} />
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
