import { ChromosomeCanvas } from './components/ChromosomeCanvas';
import { useGeneticStore } from './store/useGeneticStore';

const STATIC_LOCI = [
  { id: 'A', name: 'Agouti', chromosome: 4, basePairLocation: '4q21' },
  { id: 'C', name: 'Color / Albinism', chromosome: 1, basePairLocation: '1q12' },
];

export default function App() {
  const selectedLocusId = useGeneticStore((state) => state.selectedLocusId);
  const setSelectedLocus = useGeneticStore((state) => state.setSelectedLocus);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur p-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
            Leporidae Genetics Architecture Engine
          </h1>
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-mono border border-slate-300">
            v1.0.0 Stable
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-4 space-y-6 flex flex-col">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
            <h2 className="text-lg font-semibold border-b border-slate-200 pb-2 text-slate-700">
              Loci Matrix Selectors
            </h2>
            {STATIC_LOCI.map((locus) => (
              <button
                key={locus.id}
                type="button"
                onClick={() =>
                  setSelectedLocus(selectedLocusId === locus.id ? null : locus.id)
                }
                className={`w-full text-left p-3 rounded-lg border transition ${
                  selectedLocusId === locus.id
                    ? 'border-sky-500 bg-sky-100 ring-2 ring-sky-400/50 shadow-sm'
                    : 'border-slate-200 hover:border-sky-300 bg-slate-50 hover:bg-white'
                }`}
              >
                <div className="font-semibold text-sm text-sky-700">{locus.name} Locus</div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  Chromosome {locus.chromosome} • {locus.basePairLocation}
                </div>
              </button>
            ))}
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300 text-xs text-slate-600">
            <strong className="text-slate-700">Portfolio Tip:</strong> Click a locus card above to
            tell the R3F Canvas to draw or emphasize specific gene bands along the chromosome
            model.
          </div>
        </section>

        <section className="lg:col-span-8 flex flex-col min-h-[400px] lg:min-h-0">
          <ChromosomeCanvas />
        </section>
      </main>
    </div>
  );
}
