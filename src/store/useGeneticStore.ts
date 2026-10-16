import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  LOCI_ORDER,
  buildDefaultGenotypes,
  getLocusChromosome,
} from '../data/rabbitGenetics';
import type { CrossSnapshot } from '../utils/genotypeCodec';
import type { BCPhase } from '../utils/geneticEngine';

type ParentKey = 'parent1' | 'parent2';
type GenotypeMap = Record<string, [string, string]>;

function presetKey(parent: ParentKey): 'parent1PresetId' | 'parent2PresetId' {
  return parent === 'parent1' ? 'parent1PresetId' : 'parent2PresetId';
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
  /** How each parent's B and C alleles sit on chromosome 1; 'unknown' unless the user says. */
  bcPhase: Record<ParentKey, BCPhase>;
  setBcPhase: (parent: ParentKey, phase: BCPhase) => void;
  setSelectedLocus: (locusId: string | null) => void;
  setHoveredChromosome: (chromId: number | null) => void;
  focusProgenyGenotype: (genotype: GenotypeMap, label: string) => void;
  clearProgenyFocus: () => void;
  setParentAllele: (parent: ParentKey, locusId: string, alleleIndex: 0 | 1, alleleCode: string) => void;
  setParentGenotype: (parent: ParentKey, genotype: GenotypeMap) => void;
  loadParentPreset: (parent: ParentKey, presetId: string, genotype: GenotypeMap) => void;
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
      bcPhase: { parent1: 'unknown', parent2: 'unknown' },

      setBcPhase: (parent, phase) => set((state) => ({ bcPhase: { ...state.bcPhase, [parent]: phase } })),

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
      },

      clearProgenyFocus: () =>
        set({ highlightedLocusIds: [], progenyFocusLabel: null }),

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

      loadParentPreset: (parent, presetId, genotype) =>
        set((state) => ({
          bcPhase: { ...state.bcPhase, [parent]: 'unknown' },
          [parent]: { ...genotype },
          [presetKey(parent)]: presetId,
        })),

      clearParentPreset: (parent) =>
        set(() => ({
          [presetKey(parent)]: null,
        })),

      resetParentToPreset: (parent, genotype) =>
        set(() => ({
          [parent]: { ...genotype },
        })),

      swapParents: () =>
        set((state) => ({
          parent1: { ...state.parent2 },
          parent2: { ...state.parent1 },
          parent1PresetId: state.parent2PresetId,
          parent2PresetId: state.parent1PresetId,
          bcPhase: { parent1: state.bcPhase.parent2, parent2: state.bcPhase.parent1 },
        })),

      loadCrossSnapshot: (snapshot) =>
        set(() => ({
          parent1: { ...snapshot.parent1 },
          parent2: { ...snapshot.parent2 },
          parent1PresetId: snapshot.parent1PresetId,
          parent2PresetId: snapshot.parent2PresetId,
          bcPhase: { parent1: 'unknown', parent2: 'unknown' },
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
      version: 1,
      migrate: (persisted: unknown) => {
        const state = persisted as Pick<
          GeneticState,
          'parent1' | 'parent2' | 'parent1PresetId' | 'parent2PresetId'
        >;
        if (state.parent1PresetId === 'nz-white') {
          state.parent1PresetId = 'nz-white-field';
        }
        if (state.parent2PresetId === 'nz-white') {
          state.parent2PresetId = 'nz-white-field';
        }
        return state;
      },
      partialize: (state) => ({
        parent1: state.parent1,
        parent2: state.parent2,
        parent1PresetId: state.parent1PresetId,
        parent2PresetId: state.parent2PresetId,
        bcPhase: state.bcPhase,
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
