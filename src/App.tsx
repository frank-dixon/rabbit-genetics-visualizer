import { useState } from 'react';
import { AboutPage } from './components/AboutPage';
import { AppFooter, type AppView } from './components/AppFooter';
import { ChromosomeCanvas } from './components/ChromosomeCanvas';
import { CitationsPage } from './components/CitationsPage';
import { EyeColorPanel } from './components/EyeColorPanel';
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
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
          <h2 className="text-lg font-semibold border-b border-slate-200 dark:border-slate-800 pb-2 text-slate-700 dark:text-slate-200">
            Loci Matrix Selectors
          </h2>

          {loci.map((locus) => (
            <button
              key={locus.id}
              type="button"
              onClick={() => setSelectedLocus(selectedLocusId === locus.id ? null : locus.id)}
              className={`w-full text-left p-3 rounded-lg border transition ${
                selectedLocusId === locus.id
                  ? 'border-sky-500 bg-sky-100 dark:bg-sky-950/50 ring-2 ring-sky-400/50 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-600 bg-slate-50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-900'
              }`}
            >
              <div className="font-semibold text-sm text-sky-700 dark:text-sky-400">
                {locus.name}
                <span className="text-slate-400 dark:text-slate-500 font-normal">
                  {' '}
                  ({locus.geneSymbol})
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                {locus.chromosome !== null
                  ? `Chromosome ${locus.chromosome}${locus.cytogeneticLocation ? ` • ${locus.cytogeneticLocation}` : ''}`
                  : `${locus.geneSymbol} — chromosome unplaced in OryCun2.0`}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                {locus.meatRabbitRelevance}
              </div>
            </button>
          ))}
        </div>

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
