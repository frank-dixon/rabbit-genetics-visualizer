import { useMemo } from 'react';
import { PresetPicker } from './PresetPicker';
import { useAccountStore } from '../store/useAccountStore';
import { useStockRosterStore } from '../store/useStockRosterStore';
import { useGeneticStore } from '../store/useGeneticStore';

interface ParentSourcePickerProps {
  id: string;
  parentKey: 'parent1' | 'parent2';
  presetId: string | null;
  stockId: string | null;
  onPresetChange: (presetId: string | null) => void;
}

export function ParentSourcePicker({
  id,
  parentKey,
  presetId,
  stockId,
  onPresetChange,
}: ParentSourcePickerProps) {
  const account = useAccountStore((state) => state.account);
  const getRabbits = useStockRosterStore((state) => state.getRabbits);
  const loadParentFromStock = useGeneticStore((state) => state.loadParentFromStock);

  const stockRabbits = useMemo(
    () => (account ? getRabbits(account.id) : []),
    [account, getRabbits],
  );

  const selectedStock = stockId
    ? stockRabbits.find((rabbit) => rabbit.id === stockId)
    : null;

  return (
    <div className="space-y-2">
      <PresetPicker
        id={id}
        value={stockId ? null : presetId}
        onChange={(next) => {
          if (next) onPresetChange(next);
          else onPresetChange(null);
        }}
      />

      {account && stockRabbits.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
            From stock roster
          </p>
          <div className="flex flex-wrap gap-1.5">
            {stockRabbits.map((rabbit) => (
              <button
                key={rabbit.id}
                type="button"
                onClick={() => loadParentFromStock(parentKey, rabbit)}
                className={`text-[10px] rounded-full border px-2.5 py-1 transition ${
                  stockId === rabbit.id
                    ? 'bg-emerald-100 dark:bg-emerald-950/50 border-emerald-400 text-emerald-800 dark:text-emerald-300 font-medium'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-300'
                }`}
              >
                {rabbit.name}
                <span className="opacity-60 ml-1 capitalize">({rabbit.sex})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedStock && (
        <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
          Linked from roster — genotype locked. Unlink in Genetics &amp; editing to change alleles.
        </p>
      )}

      {!account && (
        <p className="text-[10px] text-slate-400">
          Sign in on the Stock page to pick animals from your roster.
        </p>
      )}
    </div>
  );
}
