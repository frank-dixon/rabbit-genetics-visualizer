import { create } from 'zustand';
import { buildDefaultGenotypes } from '../data/rabbitGenetics';

type ParentKey = 'parent1' | 'parent2';
type GenotypeMap = Record<string, [string, string]>;

interface GeneticState {
  selectedLocusId: string | null;
  hoveredChromosome: number | null;
  parent1: GenotypeMap;
  parent2: GenotypeMap;
  setSelectedLocus: (locusId: string | null) => void;
  setHoveredChromosome: (chromId: number | null) => void;
  setParentAllele: (parent: ParentKey, locusId: string, alleleIndex: 0 | 1, alleleCode: string) => void;
  setParentGenotype: (parent: ParentKey, genotype: GenotypeMap) => void;
  swapParents: () => void;
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

  setParentGenotype: (parent, genotype) =>
    set(() => ({
      [parent]: { ...genotype },
    })),

  swapParents: () =>
    set((state) => ({
      parent1: { ...state.parent2 },
      parent2: { ...state.parent1 },
    })),
}));
