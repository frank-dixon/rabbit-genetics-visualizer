import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  LOCI_ORDER,
  buildDefaultGenotypes,
  getLocusChromosome,
} from '../data/rabbitGenetics';
import type { StockRabbit } from '../types/stockRabbit';
import type { CrossSnapshot } from '../utils/genotypeCodec';
import { openChromosomeExplorer } from '../utils/referenceNavigation';

type ParentKey = 'parent1' | 'parent2';
type GenotypeMap = Record<string, [string, string]>;

function presetKey(parent: ParentKey): 'parent1PresetId' | 'parent2PresetId' {
  return parent === 'parent1' ? 'parent1PresetId' : 'parent2PresetId';
}

function stockKey(parent: ParentKey): 'parent1StockId' | 'parent2StockId' {
  return parent === 'parent1' ? 'parent1StockId' : 'parent2StockId';
}

function clearStockLink(parent: ParentKey): Pick<GeneticState, 'parent1StockId' | 'parent2StockId'> {
  return { [stockKey(parent)]: null } as Pick<GeneticState, 'parent1StockId' | 'parent2StockId'>;
}

interface GeneticState {
  selectedLocusId: string | null;
  highlightedLocusIds: string[];
  progenyFocusLabel: string | null;
  hoveredChromosome: number | null;
  parent1: GenotypeMap;
  parent2: GenotypeMap;
  parent1PresetId: string | null;
  parent2PresetId: string | null;
  parent1StockId: string | null;
  parent2StockId: string | null;
  setSelectedLocus: (locusId: string | null) => void;
  setHoveredChromosome: (chromId: number | null) => void;
  focusProgenyGenotype: (genotype: GenotypeMap, label: string) => void;
  clearProgenyFocus: () => void;
  setParentAllele: (parent: ParentKey, locusId: string, alleleIndex: 0 | 1, alleleCode: string) => void;
  setParentGenotype: (parent: ParentKey, genotype: GenotypeMap) => void;
  loadParentPreset: (parent: ParentKey, presetId: string, genotype: GenotypeMap) => void;
  loadParentFromStock: (parent: ParentKey, rabbit: StockRabbit) => void;
  clearParentStockLink: (parent: ParentKey) => void;
  clearParentPreset: (parent: ParentKey) => void;
  resetParentToPreset: (parent: ParentKey, genotype: GenotypeMap) => void;
  swapParents: () => void;
  loadCrossSnapshot: (snapshot: CrossSnapshot) => void;
  getCrossSnapshot: () => CrossSnapshot;
}

const defaultGenotypes = buildDefaultGenotypes();

export const useGeneticStore = create<GeneticState>()(
  persist(
    (set, get) => ({
      selectedLocusId: null,
      highlightedLocusIds: [],
      progenyFocusLabel: null,
      hoveredChromosome: null,
      parent1: { ...defaultGenotypes, A: ['A', 'a'], C: ['C', 'c'] },
      parent2: { ...defaultGenotypes, A: ['a', 'a'], C: ['C', 'C'] },
      parent1PresetId: null,
      parent2PresetId: null,
      parent1StockId: null,
      parent2StockId: null,

      setSelectedLocus: (locusId) =>
        set({ selectedLocusId: locusId, progenyFocusLabel: null, highlightedLocusIds: [] }),

      setHoveredChromosome: (chromId) => set({ hoveredChromosome: chromId }),

      focusProgenyGenotype: (genotype, label) => {
        const locusIds = LOCI_ORDER.filter((locusId) => genotype[locusId]);
        const firstMapped =
          locusIds.find((locusId) => getLocusChromosome(locusId) !== null) ?? locusIds[0] ?? null;

        set({
          highlightedLocusIds: locusIds,
          selectedLocusId: firstMapped,
          progenyFocusLabel: label,
        });
        openChromosomeExplorer();
      },

      clearProgenyFocus: () =>
        set({ highlightedLocusIds: [], progenyFocusLabel: null }),

      setParentAllele: (parent, locusId, alleleIndex, alleleCode) =>
        set((state) => {
          const updatedParent = { ...state[parent] };
          updatedParent[locusId] = [...updatedParent[locusId]] as [string, string];
          updatedParent[locusId][alleleIndex] = alleleCode;
          return { [parent]: updatedParent, ...clearStockLink(parent) };
        }),

      setParentGenotype: (parent, genotype) =>
        set(() => ({
          [parent]: { ...genotype },
          ...clearStockLink(parent),
        })),

      loadParentPreset: (parent, presetId, genotype) =>
        set(() => ({
          [parent]: { ...genotype },
          [presetKey(parent)]: presetId,
          ...clearStockLink(parent),
        })),

      loadParentFromStock: (parent, rabbit) =>
        set(() => ({
          [parent]: { ...rabbit.resolvedGenotype },
          [presetKey(parent)]: null,
          [stockKey(parent)]: rabbit.id,
        })),

      clearParentStockLink: (parent) => set(() => clearStockLink(parent)),

      clearParentPreset: (parent) =>
        set(() => ({
          [presetKey(parent)]: null,
          ...clearStockLink(parent),
        })),

      resetParentToPreset: (parent, genotype) =>
        set(() => ({
          [parent]: { ...genotype },
          ...clearStockLink(parent),
        })),

      swapParents: () =>
        set((state) => ({
          parent1: { ...state.parent2 },
          parent2: { ...state.parent1 },
          parent1PresetId: state.parent2PresetId,
          parent2PresetId: state.parent1PresetId,
          parent1StockId: state.parent2StockId,
          parent2StockId: state.parent1StockId,
        })),

      loadCrossSnapshot: (snapshot) =>
        set(() => ({
          parent1: { ...snapshot.parent1 },
          parent2: { ...snapshot.parent2 },
          parent1PresetId: snapshot.parent1PresetId,
          parent2PresetId: snapshot.parent2PresetId,
          parent1StockId: null,
          parent2StockId: null,
        })),

      getCrossSnapshot: () => {
        const state = get();
        return {
          parent1: state.parent1,
          parent2: state.parent2,
          parent1PresetId: state.parent1PresetId,
          parent2PresetId: state.parent2PresetId,
        };
      },
    }),
    {
      name: 'rabbit-progeny-cross',
      version: 2,
      migrate: (persisted: unknown, version) => {
        const state = persisted as {
          parent1: GenotypeMap;
          parent2: GenotypeMap;
          parent1PresetId: string | null;
          parent2PresetId: string | null;
          parent1StockId?: string | null;
          parent2StockId?: string | null;
        };
        if (state.parent1PresetId === 'nz-white') {
          state.parent1PresetId = 'nz-white-field';
        }
        if (state.parent2PresetId === 'nz-white') {
          state.parent2PresetId = 'nz-white-field';
        }
        if (version < 2) {
          state.parent1StockId = state.parent1StockId ?? null;
          state.parent2StockId = state.parent2StockId ?? null;
        }
        return state;
      },
      partialize: (state) => ({
        parent1: state.parent1,
        parent2: state.parent2,
        parent1PresetId: state.parent1PresetId,
        parent2PresetId: state.parent2PresetId,
        parent1StockId: state.parent1StockId,
        parent2StockId: state.parent2StockId,
      }),
    },
  ),
);

export function genotypesEqual(a: GenotypeMap, b: GenotypeMap): boolean {
  return LOCI_ORDER.every((locusId) => {
    const pairA = a[locusId];
    const pairB = b[locusId];
    if (!pairA || !pairB) return !pairA && !pairB;
    return pairA[0] === pairB[0] && pairA[1] === pairB[1];
  });
}
