import { useState } from 'react';
import { ArrowLeft, Download, Upload } from 'lucide-react';
import { WORKSPACE_MAX_WIDTH } from '../constants/layout';
import { useAccountStore } from '../store/useAccountStore';
import { useGeneticStore } from '../store/useGeneticStore';
import { useStockRosterStore } from '../store/useStockRosterStore';
import { AccountPanel } from './stock/AccountPanel';
import { AddStockRabbitWizard } from './stock/AddStockRabbitWizard';
import { StockRabbitCard } from './stock/StockRabbitCard';

interface StockRosterPageProps {
  onBack: () => void;
  onGoToPredictor?: () => void;
}

export function StockRosterPage({ onBack, onGoToPredictor }: StockRosterPageProps) {
  const account = useAccountStore((state) => state.account);
  const getRabbits = useStockRosterStore((state) => state.getRabbits);
  const addRabbit = useStockRosterStore((state) => state.addRabbit);
  const deleteRabbit = useStockRosterStore((state) => state.deleteRabbit);
  const exportRoster = useStockRosterStore((state) => state.exportRoster);
  const importRoster = useStockRosterStore((state) => state.importRoster);
  const loadParentFromStock = useGeneticStore((state) => state.loadParentFromStock);

  const [showWizard, setShowWizard] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const rabbits = account ? getRabbits(account.id) : [];

  const handleExport = async () => {
    if (!account) return;
    const json = exportRoster(account.id);
    try {
      await navigator.clipboard.writeText(json);
    } catch {
      // clipboard optional
    }
  };

  const handleImport = () => {
    if (!account) return;
    const payload = window.prompt('Paste your exported roster JSON:');
    if (!payload) return;
    const result = importRoster(account.id, payload);
    setImportError(result.ok ? null : result.error);
  };

  return (
    <main className="flex-1 min-h-0 overflow-y-auto">
      <div className={`${WORKSPACE_MAX_WIDTH} mx-auto p-4 pb-10 space-y-5`}>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-sky-700 dark:text-sky-400 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to workspace
        </button>

        <header className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Stock roster</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
            Log the rabbits you actually own — name, sex, and genotype confidence per locus. Use
            export/import to move your roster between devices.
          </p>
        </header>

        <AccountPanel />

        {account && (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowWizard(true)}
                className="text-sm font-medium rounded-md bg-sky-600 hover:bg-sky-700 text-white px-4 py-2"
              >
                Add rabbit
              </button>
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center gap-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 px-3 py-1.5 hover:border-sky-300"
              >
                <Download className="h-3.5 w-3.5" />
                Export roster
              </button>
              <button
                type="button"
                onClick={handleImport}
                className="inline-flex items-center gap-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 px-3 py-1.5 hover:border-sky-300"
              >
                <Upload className="h-3.5 w-3.5" />
                Import roster
              </button>
            </div>

            {importError && (
              <p className="text-xs text-rose-600 dark:text-rose-400">{importError}</p>
            )}

            {showWizard && (
              <AddStockRabbitWizard
                onCancel={() => setShowWizard(false)}
                onSave={(draft) => {
                  addRabbit(account.id, draft);
                  setShowWizard(false);
                }}
              />
            )}

            {rabbits.length === 0 && !showWizard && (
              <p className="text-sm text-center text-slate-500 dark:text-slate-400 py-12">
                No rabbits yet. Add your first buck or doe to build your roster.
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {rabbits.map((rabbit) => (
                <StockRabbitCard
                  key={rabbit.id}
                  rabbit={rabbit}
                  onDelete={() => deleteRabbit(account.id, rabbit.id)}
                  onUseAsParent={(parent) => {
                    loadParentFromStock(parent, rabbit);
                    onGoToPredictor?.();
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
