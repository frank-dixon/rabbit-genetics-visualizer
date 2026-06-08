import { create } from 'zustand';

interface GeneticState {
  selectedLocusId: string | null;
  hoveredChromosome: number | null;
  setSelectedLocus: (locusId: string | null) => void;
  setHoveredChromosome: (chromId: number | null) => void;
}

export const useGeneticStore = create<GeneticState>((set) => ({
  selectedLocusId: null,
  hoveredChromosome: null,

  setSelectedLocus: (locusId) => set({ selectedLocusId: locusId }),
  setHoveredChromosome: (chromId) => set({ hoveredChromosome: chromId }),
}));
