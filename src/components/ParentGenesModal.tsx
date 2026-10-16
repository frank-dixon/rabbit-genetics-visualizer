import { useEffect, useRef, type ReactNode } from 'react';
import { CoatTile } from './CoatTile';
import { HairBar } from './HairBar';

interface ParentGenesModalProps {
  open: boolean;
  onClose: () => void;
  titleId: string;
  kicker: string;
  title: string;
  children: ReactNode;
  genotype?: Record<string, [string, string]>;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

/** Overlay for a parent's genes. Same shell as the Learn more modal, plus a focus trap and focus return. */
export function ParentGenesModal({ open, onClose, titleId, kicker, title, children, genotype }: ParentGenesModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      opener?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-stretch justify-center bg-[rgba(19,32,59,0.55)] sm:items-center"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="h-full w-full overflow-y-auto overscroll-contain bg-paper sm:h-auto sm:max-h-[86vh] sm:w-[min(760px,94vw)] sm:border sm:border-ink"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-rule bg-paper px-5 py-4 sm:px-7">
          {genotype && <CoatTile genotype={genotype} name={title} size="sm" className="h-16 w-16 shrink-0 rounded-[6px] border border-ink/20" />}
          <div className="min-w-0 flex-1">
            <p className="kicker text-ink-muted">{kicker}</p>
            <h2 id={titleId} className="headline mt-1 text-2xl sm:text-3xl">
              {title}
            </h2>
            {genotype && <HairBar genotype={genotype} labeled className="mt-2 max-w-[20rem]" />}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="btn-block btn-outline shrink-0 whitespace-nowrap !px-3 !py-2 text-ink"
          >
            Close ✕
          </button>
        </div>
        <div className="space-y-4 px-5 py-6 text-ink-soft sm:px-7">{children}</div>
      </div>
    </div>
  );
}
