import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

interface InfoPageProps {
  title: string;
  onBack: () => void;
  children: ReactNode;
}

export function InfoPage({ title, onBack, children }: InfoPageProps) {
  return (
    <main className="flex-1 min-h-0 overflow-y-auto">
      <div className="max-w-3xl mx-auto p-4 pb-8 space-y-6 text-sm text-slate-700 dark:text-slate-300">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-sky-700 dark:text-sky-400 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to workspace
        </button>

        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{title}</h1>

        <div className="space-y-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-slate-800 dark:[&_h2]:text-slate-100 [&_h2]:mt-6 [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_a]:text-sky-600 dark:[&_a]:text-sky-400 [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-slate-800 dark:[&_strong]:text-slate-100">
          {children}
        </div>
      </div>
    </main>
  );
}
