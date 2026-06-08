export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
            Leporidae Genetics Architecture Engine
          </h1>
          <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full font-mono border border-slate-700">
            v1.0.0 Stable
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-4 space-y-6 flex flex-col">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-lg font-semibold border-b border-slate-800 pb-2">
              Loci Matrix Selectors
            </h2>
            <div className="bg-slate-950 p-4 rounded-xl border border-dashed border-slate-800 text-xs text-slate-400">
              Loci Matrix Selectors — coming soon
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-dashed border-slate-800 text-xs text-slate-400">
            <strong className="text-slate-200">Portfolio Tip:</strong> Click a locus card above to
            tell the R3F Canvas to draw or emphasize specific gene bands along the chromosome
            model.
          </div>
        </section>

        <section className="lg:col-span-8 flex flex-col min-h-[400px] lg:min-h-0">
          <div className="w-full h-[400px] md:h-full min-h-[400px] bg-slate-950 rounded-xl overflow-hidden relative border border-slate-800 flex items-center justify-center">
            <p className="text-sm text-slate-500 font-mono">3D Chromosome Workspace — coming soon</p>
          </div>
        </section>
      </main>
    </div>
  );
}
