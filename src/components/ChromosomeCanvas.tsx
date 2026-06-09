import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useTheme } from '../store/useThemeStore';
import { useGeneticStore } from '../store/useGeneticStore';
import { ChromosomeMesh } from './ChromosomeMesh';

const LOCUS_CHROMOSOME: Record<string, number> = {
  A: 4,
  C: 1,
};

const CANVAS_BACKGROUNDS = {
  light: '#e2e8f0',
  dark: '#0f172a',
} as const;

export function ChromosomeCanvas() {
  const { isDark } = useTheme();
  const selectedLocusId = useGeneticStore((state) => state.selectedLocusId);
  const focusedChromosome = selectedLocusId ? LOCUS_CHROMOSOME[selectedLocusId] : null;
  const canvasBackground = isDark ? CANVAS_BACKGROUNDS.dark : CANVAS_BACKGROUNDS.light;

  return (
    <div className="w-full h-[400px] md:h-full min-h-[400px] bg-slate-200 dark:bg-slate-950 rounded-xl overflow-hidden relative border border-slate-300 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <Canvas className="!absolute inset-0" camera={{ position: [0, 0, 8], fov: 50 }}>
        <color attach="background" args={[canvasBackground]} />
        <ambientLight intensity={isDark ? 0.45 : 0.7} />
        <pointLight position={[10, 10, 10]} intensity={isDark ? 1.4 : 1.2} />
        <directionalLight position={[-5, 5, -5]} intensity={isDark ? 0.35 : 0.6} />

        <ChromosomeMesh
          chromosomeNumber={1}
          position={[-1.5, 0, 0]}
          isFocused={focusedChromosome === 1}
          isDark={isDark}
        />
        <ChromosomeMesh
          chromosomeNumber={4}
          position={[1.5, 0, 0]}
          isFocused={focusedChromosome === 4}
          isDark={isDark}
        />

        <OrbitControls enableZoom enablePan={false} minDistance={3} maxDistance={20} />
      </Canvas>

      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute top-4 left-4 text-xs font-mono text-slate-700 dark:text-slate-200 bg-white/95 dark:bg-slate-900/95 px-3 py-1.5 rounded border border-sky-300 dark:border-sky-700 backdrop-blur shadow-sm">
          Active Locus Focus:{' '}
          <span className="font-semibold text-sky-700 dark:text-sky-400">
            {selectedLocusId || 'None (Orbit Mode)'}
          </span>
        </div>

        {focusedChromosome && (
          <div className="absolute bottom-4 left-4 text-xs text-slate-600 dark:text-slate-300 bg-white/95 dark:bg-slate-900/95 px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 shadow-sm">
            Highlighting chromosome {focusedChromosome}
          </div>
        )}
      </div>
    </div>
  );
}
