import { useState, type FormEvent } from 'react';
import { useAccountStore } from '../../store/useAccountStore';

export function AccountPanel() {
  const account = useAccountStore((state) => state.account);
  const signUp = useAccountStore((state) => state.signUp);
  const signIn = useAccountStore((state) => state.signIn);
  const signOut = useAccountStore((state) => state.signOut);

  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (account) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {account.displayName}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{account.email}</p>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="text-xs text-slate-500 hover:text-rose-600 dark:hover:text-rose-400"
        >
          Sign out
        </button>
      </div>
    );
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    const result = mode === 'signup' ? signUp(email, displayName) : signIn(email);
    if (!result.ok) {
      setError(result.error);
    }
  };

  return (
    <div className="rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-950/20 p-4 space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Free account
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Save your stock roster on this device. Export/import to move between browsers until cloud
          sync ships.
        </p>
      </div>

      <div className="flex gap-2">
        {(['signup', 'signin'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setMode(tab);
              setError(null);
            }}
            className={`text-xs px-3 py-1 rounded-full border transition ${
              mode === tab
                ? 'bg-sky-100 dark:bg-sky-950/60 border-sky-400 text-sky-800 dark:text-sky-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            {tab === 'signup' ? 'Create account' : 'Sign in'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        {mode === 'signup' && (
          <input
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Display name (optional)"
            className="w-full text-sm rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 py-2"
          />
        )}
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          className="w-full text-sm rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 py-2"
        />
        {error && <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}
        <button
          type="submit"
          className="text-sm font-medium rounded-md bg-sky-600 hover:bg-sky-700 text-white px-4 py-2"
        >
          {mode === 'signup' ? 'Create free account' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
