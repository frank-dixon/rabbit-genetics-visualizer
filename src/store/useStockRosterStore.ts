import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StockRabbit, StockRabbitDraft } from '../types/stockRabbit';
import { resolveGenotypeFromLoci } from '../utils/stockGenotype';

interface RosterByAccount {
  [accountId: string]: StockRabbit[];
}

interface StockRosterState {
  rosters: RosterByAccount;
  addRabbit: (accountId: string, draft: StockRabbitDraft) => StockRabbit;
  updateRabbit: (accountId: string, rabbitId: string, draft: StockRabbitDraft) => void;
  deleteRabbit: (accountId: string, rabbitId: string) => void;
  getRabbits: (accountId: string) => StockRabbit[];
  exportRoster: (accountId: string) => string;
  importRoster: (accountId: string, payload: string) => { ok: true } | { ok: false; error: string };
}

function buildRabbit(accountId: string, draft: StockRabbitDraft): StockRabbit {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    accountId,
    name: draft.name.trim(),
    sex: draft.sex,
    dateOfBirth: draft.dateOfBirth || null,
    earTag: draft.earTag.trim() || null,
    notes: draft.notes.trim(),
    sourcePresetId: draft.sourcePresetId,
    loci: draft.loci,
    resolvedGenotype: resolveGenotypeFromLoci(draft.loci),
    createdAt: now,
    updatedAt: now,
  };
}

export const useStockRosterStore = create<StockRosterState>()(
  persist(
    (set, get) => ({
      rosters: {},

      getRabbits: (accountId) => get().rosters[accountId] ?? [],

      addRabbit: (accountId, draft) => {
        const rabbit = buildRabbit(accountId, draft);
        set((state) => ({
          rosters: {
            ...state.rosters,
            [accountId]: [rabbit, ...(state.rosters[accountId] ?? [])],
          },
        }));
        return rabbit;
      },

      updateRabbit: (accountId, rabbitId, draft) => {
        set((state) => ({
          rosters: {
            ...state.rosters,
            [accountId]: (state.rosters[accountId] ?? []).map((rabbit) =>
              rabbit.id === rabbitId
                ? {
                    ...rabbit,
                    name: draft.name.trim(),
                    sex: draft.sex,
                    dateOfBirth: draft.dateOfBirth || null,
                    earTag: draft.earTag.trim() || null,
                    notes: draft.notes.trim(),
                    sourcePresetId: draft.sourcePresetId,
                    loci: draft.loci,
                    resolvedGenotype: resolveGenotypeFromLoci(draft.loci),
                    updatedAt: Date.now(),
                  }
                : rabbit,
            ),
          },
        }));
      },

      deleteRabbit: (accountId, rabbitId) => {
        set((state) => ({
          rosters: {
            ...state.rosters,
            [accountId]: (state.rosters[accountId] ?? []).filter((r) => r.id !== rabbitId),
          },
        }));
      },

      exportRoster: (accountId) => {
        const rabbits = get().rosters[accountId] ?? [];
        return JSON.stringify({ version: 1, accountId, rabbits }, null, 2);
      },

      importRoster: (accountId, payload) => {
        try {
          const parsed = JSON.parse(payload) as {
            version?: number;
            accountId?: string;
            rabbits?: StockRabbit[];
          };
          const rabbits = parsed.rabbits;
          if (!Array.isArray(rabbits)) {
            return { ok: false, error: 'Invalid roster file.' };
          }
          set((state) => ({
            rosters: {
              ...state.rosters,
              [accountId]: rabbits.map((rabbit) => ({
                ...rabbit,
                accountId,
                resolvedGenotype: resolveGenotypeFromLoci(rabbit.loci),
              })),
            },
          }));
          return { ok: true };
        } catch {
          return { ok: false, error: 'Could not parse roster JSON.' };
        }
      },
    }),
    {
      name: 'rabbit-progeny-stock-roster',
    },
  ),
);
