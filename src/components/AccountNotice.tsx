import { useState } from 'react';

/** Accounts are not built yet: an honest placeholder, no fake auth. */
export function AccountButton({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`btn-block btn-lichen !border-0 ${compact ? '!px-3 !py-1.5 !text-[10px]' : '!px-4 !py-1.5 !text-[11px]'}`}
      >
        {compact ? 'Save' : 'Create account'}
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="Accounts are coming"
          className="absolute right-0 top-full mt-2 w-72 border border-ink bg-paper p-4 text-sm text-ink z-[80]"
        >
          <p className="kicker text-teal-deep">Accounts are coming</p>
          <p className="mt-2 leading-snug">
            Your herd, crosses and settings are already saved on this device. Accounts that sync across
            devices aren&apos;t available yet.
          </p>
          <button type="button" className="kicker mt-3 underline" onClick={() => setOpen(false)}>
            Got it
          </button>
        </div>
      )}
    </div>
  );
}

export function GuestBanner() {
  return (
    <div className="mx-auto mt-2 max-w-6xl text-[12px] text-ink-soft">
      <div className="glass flex items-center gap-3 px-4 py-1.5">
        <p className="min-w-0">
          Free, no account needed. Your crosses stay on this device.
          <span className="hidden sm:inline"> Accounts that sync are coming soon.</span>
        </p>
        <span className="kicker ml-auto hidden shrink-0 text-[10px] text-teal-deep md:inline">
          Installable · works offline
        </span>
      </div>
    </div>
  );
}
