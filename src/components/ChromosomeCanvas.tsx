import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import {
  getLocusChromosome,
  getLociOnChromosome,
  getMappedChromosomes,
  RABBIT_GENETIC_MAP,
} from '../data/rabbitGenetics';
import { useTheme } from '../store/useThemeStore';
import { useGeneticStore } from '../store/useGeneticStore';
import { ChromosomeMesh } from './ChromosomeMesh';

const CANVAS_BACKGROUNDS = {
  light: '#e2e8f0',
  dark: '#0f172a',
} as const;

function spreadChromosomePositions(count: number): [number, number, number][] {
  if (count === 1) return [[0, 0, 0]];
  const span = Math.min(6, count * 2);
  const start = -span / 2;
  const step = count > 1 ? span / (count - 1) : 0;
  return Array.from({ length: count }, (_, index) => [start + step * index, 0, 0]);
}

function formatLocusGenes(chromosomeNumber: number): string {
  return getLociOnChromosome(chromosomeNumber)
    .map((locus) => `${locus.id} (${locus.geneSymbol})`)
    .join(', ');
}

export function ChromosomeCanvas() {
  const { isDark } = useTheme();
  const selectedLocusId = useGeneticStore((state) => state.selectedLocusId);
  const highlightedLocusIds = useGeneticStore((state) => state.highlightedLocusIds);
  const progenyFocusLabel = useGeneticStore((state) => state.progenyFocusLabel);
  const focusedChromosome = selectedLocusId ? getLocusChromosome(selectedLocusId) : null;
  const canvasBackground = isDark ? CANVAS_BACKGROUNDS.dark : CANVAS_BACKGROUNDS.light;

  const chromosomes = getMappedChromosomes();
  const positions = spreadChromosomePositions(chromosomes.length);
  const selectedLocus = selectedLocusId ? RABBIT_GENETIC_MAP[selectedLocusId] : null;

  return (
    <div className="w-full h-[400px] lg:h-[480px] lg:max-h-[min(480px,55vh)] shrink-0 bg-slate-200 dark:bg-slate-950 rounded-xl overflow-hidden relative border border-slate-300 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <Canvas className="!absolute inset-0" camera={{ position: [0, 0, 10], fov: 50 }}>
        <color attach="background" args={[canvasBackground]} />
        <ambientLight intensity={isDark ? 0.55 : 0.75} />
        <hemisphereLight
          args={[isDark ? '#64748b' : '#f8fafc', isDark ? '#0f172a' : '#cbd5e1', 0.45]}
        />
        <pointLight position={[10, 10, 10]} intensity={isDark ? 1.25 : 1.1} />
        <pointLight position={[-8, -4, 6]} intensity={isDark ? 0.45 : 0.35} />
        <directionalLight position={[-5, 5, -5]} intensity={isDark ? 0.4 : 0.55} />

        {chromosomes.map((chromosomeNumber, index) => (
          <ChromosomeMesh
            key={chromosomeNumber}
            chromosomeNumber={chromosomeNumber}
            position={positions[index]}
            isFocused={focusedChromosome === chromosomeNumber}
            isDark={isDark}
            selectedLocusId={selectedLocusId}
            highlightedLocusIds={highlightedLocusIds}
          />
        ))}

        <OrbitControls enableZoom enablePan={false} minDistance={4} maxDistance={24} />
      </Canvas>

      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute top-4 left-4 text-xs font-mono text-slate-700 dark:text-slate-200 bg-white/95 dark:bg-slate-900/95 px-3 py-1.5 rounded border border-sky-300 dark:border-sky-700 backdrop-blur shadow-sm max-w-[90%]">
          {progenyFocusLabel ? (
            <>
              Progeny focus:{' '}
              <span className="font-semibold text-sky-700 dark:text-sky-400">
                {progenyFocusLabel}
              </span>
              {highlightedLocusIds.length > 0 && (
                <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-sans">
                  Loci: {highlightedLocusIds.join(' · ')}
                </span>
              )}
            </>
          ) : (
            <>
              Active Locus Focus:{' '}
              <span className="font-semibold text-sky-700 dark:text-sky-400">
                {selectedLocusId || 'None (Orbit Mode)'}
              </span>
            </>
          )}
        </div>

        {focusedChromosome !== null && selectedLocus && (
          <div className="absolute top-4 right-4 text-xs text-slate-600 dark:text-slate-300 bg-white/95 dark:bg-slate-900/95 px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 shadow-sm max-w-[45%] text-right">
            <span className="font-semibold text-sky-700 dark:text-sky-400">{selectedLocus.id}</span>{' '}
            — {selectedLocus.geneSymbol} on OCU{focusedChromosome}
          </div>
        )}

        {focusedChromosome !== null && (
          <div className="absolute bottom-4 left-4 text-xs text-slate-600 dark:text-slate-300 bg-white/95 dark:bg-slate-900/95 px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 shadow-sm max-w-[90%]">
            <span className="font-semibold">OCU{focusedChromosome}</span> —{' '}
            {formatLocusGenes(focusedChromosome)}
          </div>
        )}

        {selectedLocusId && focusedChromosome === null && (
          <div className="absolute bottom-4 left-4 text-xs text-slate-600 dark:text-slate-300 bg-white/95 dark:bg-slate-900/95 px-3 py-1.5 rounded border border-amber-300 dark:border-amber-700 shadow-sm max-w-[90%]">
            {selectedLocusId} ({RABBIT_GENETIC_MAP[selectedLocusId]?.geneSymbol}) — no anchored
            chromosome in OryCun2.0 reference genome
          </div>
        )}
      </div>
    </div>
  );
}
