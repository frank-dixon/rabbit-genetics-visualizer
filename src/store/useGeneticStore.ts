import { create } from 'zustand';
import { buildDefaultGenotypes } from '../data/rabbitGenetics';

interface GeneticState {
  selectedLocusId: string | null;
  hoveredChromosome: number | null;
  parent1: Record<string, [string, string]>;
  parent2: Record<string, [string, string]>;
  setSelectedLocus: (locusId: string | null) => void;
  setHoveredChromosome: (chromId: number | null) => void;
  setParentAllele: (
    parent: 'parent1' | 'parent2',
    locusId: string,
    alleleIndex: 0 | 1,
    alleleCode: string,
  ) => void;
}

const defaultGenotypes = buildDefaultGenotypes();

export const useGeneticStore = create<GeneticState>((set) => ({
  selectedLocusId: null,
  hoveredChromosome: null,
  parent1: { ...defaultGenotypes, A: ['A', 'a'], C: ['C', 'c'] },
  parent2: { ...defaultGenotypes, A: ['a', 'a'], C: ['C', 'C'] },

  setSelectedLocus: (locusId) => set({ selectedLocusId: locusId }),
  setHoveredChromosome: (chromId) => set({ hoveredChromosome: chromId }),

  setParentAllele: (parent, locusId, alleleIndex, alleleCode) =>
    set((state) => {
      const updatedParent = { ...state[parent] };
      updatedParent[locusId] = [...updatedParent[locusId]] as [string, string];
      updatedParent[locusId][alleleIndex] = alleleCode;
      return { [parent]: updatedParent };
    }),
}));
