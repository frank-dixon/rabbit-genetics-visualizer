import { useState } from 'react';
import { AboutPage } from './components/AboutPage';
import { AppFooter, type AppView } from './components/AppFooter';
import { ChromosomeCanvas } from './components/ChromosomeCanvas';
import { CitationsPage } from './components/CitationsPage';
import { EyeColorPanel } from './components/EyeColorPanel';
import { LociMatrixPanel } from './components/LociMatrixPanel';
import { ParentGenotypePanel } from './components/ParentGenotypePanel';
import { ThemeToggle } from './components/ThemeToggle';
import { LOCI_ORDER, RABBIT_GENETIC_MAP } from './data/rabbitGenetics';
import { useGeneticStore } from './store/useGeneticStore';
import { useThemeStore } from './store/useThemeStore';

function WorkspaceView() {
  const selectedLocusId = useGeneticStore((state) => state.selectedLocusId);
  const setSelectedLocus = useGeneticStore((state) => state.setSelectedLocus);
  const loci = LOCI_ORDER.map((id) => RABBIT_GENETIC_MAP[id]).filter(Boolean);

  return (
    <main className="flex-1 min-h-0 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:overflow-hidden">
      <section className="lg:col-span-4 space-y-6 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:pr-1">
        <LociMatrixPanel
          loci={loci}
          selectedLocusId={selectedLocusId}
          onSelectLocus={setSelectedLocus}
        />

        <ParentGenotypePanel />

        <EyeColorPanel />
      </section>

      <section className="lg:col-span-8 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:pr-1">
        <ChromosomeCanvas />
      </section>
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
      <header className="shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur p-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Leporidae Genetics Architecture Engine
          </h1>

          <div className="flex items-center gap-3 shrink-0">
            <ThemeToggle />
            <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-full font-mono border border-slate-300 dark:border-slate-700">
              v1.0.0 Stable
            </span>
          </div>
        </div>
      </header>

      {view === 'workspace' && <WorkspaceView />}
      {view === 'about' && <AboutPage onBack={() => setView('workspace')} />}
      {view === 'citations' && <CitationsPage onBack={() => setView('workspace')} />}

      <AppFooter view={view} onNavigate={setView} />
    </div>
  );
}
