import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Account {
  id: string;
  email: string;
  displayName: string;
  createdAt: number;
}

interface AccountState {
  account: Account | null;
  signUp: (email: string, displayName: string) => { ok: true } | { ok: false; error: string };
  signIn: (email: string) => { ok: true } | { ok: false; error: string };
  signOut: () => void;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function accountIdFromEmail(email: string): string {
  return `acct-${normalizeEmail(email)}`;
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set, get) => ({
      account: null,

      signUp: (email, displayName) => {
        const normalized = normalizeEmail(email);
        if (!normalized.includes('@')) {
          return { ok: false, error: 'Enter a valid email address.' };
        }
        const name = displayName.trim() || normalized.split('@')[0];
        const account: Account = {
          id: accountIdFromEmail(normalized),
          email: normalized,
          displayName: name,
          createdAt: Date.now(),
        };
        set({ account });
        return { ok: true };
      },

      signIn: (email) => {
        const normalized = normalizeEmail(email);
        if (!normalized.includes('@')) {
          return { ok: false, error: 'Enter a valid email address.' };
        }
        const existing = get().account;
        if (existing?.email === normalized) {
          return { ok: true };
        }
        return {
          ok: false,
          error: 'No account on this device for that email. Create a free account first.',
        };
      },

      signOut: () => set({ account: null }),
    }),
    {
      name: 'rabbit-progeny-account',
    },
  ),
);
