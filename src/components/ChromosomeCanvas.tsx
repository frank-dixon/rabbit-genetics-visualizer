import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useGeneticStore } from '../store/useGeneticStore';
import { ChromosomeMesh } from './ChromosomeMesh';

const LOCUS_CHROMOSOME: Record<string, number> = {
  A: 4,
  C: 1,
};

export function ChromosomeCanvas() {
  const selectedLocusId = useGeneticStore((state) => state.selectedLocusId);
  const focusedChromosome = selectedLocusId ? LOCUS_CHROMOSOME[selectedLocusId] : null;

  return (
    <div className="w-full h-[400px] md:h-full min-h-[400px] bg-slate-200 rounded-xl overflow-hidden relative border border-slate-300 shadow-sm">
      <Canvas className="!absolute inset-0" camera={{ position: [0, 0, 8], fov: 50 }}>
        <color attach="background" args={['#e2e8f0']} />
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <directionalLight position={[-5, 5, -5]} intensity={0.6} />

        <ChromosomeMesh
          chromosomeNumber={1}
          position={[-1.5, 0, 0]}
          isFocused={focusedChromosome === 1}
        />
        <ChromosomeMesh
          chromosomeNumber={4}
          position={[1.5, 0, 0]}
          isFocused={focusedChromosome === 4}
        />

        <OrbitControls enableZoom enablePan={false} minDistance={3} maxDistance={20} />
      </Canvas>

      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute top-4 left-4 text-xs font-mono text-slate-700 bg-white/95 px-3 py-1.5 rounded border border-sky-300 backdrop-blur shadow-sm">
          Active Locus Focus:{' '}
          <span className="font-semibold text-sky-700">
            {selectedLocusId || 'None (Orbit Mode)'}
          </span>
        </div>

        {focusedChromosome && (
          <div className="absolute bottom-4 left-4 text-xs text-slate-600 bg-white/95 px-3 py-1.5 rounded border border-slate-300 shadow-sm">
            Highlighting chromosome {focusedChromosome}
          </div>
        )}
      </div>
    </div>
  );
}
