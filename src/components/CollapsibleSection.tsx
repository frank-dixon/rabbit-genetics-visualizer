import type { ReactNode } from 'react';
import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CollapsibleSectionProps {
  title: ReactNode;
  subtitle?: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  highlighted?: boolean;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
}

export function CollapsibleSection({
  title,
  subtitle,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  highlighted = false,
  children,
  className = '',
  headerClassName = '',
}: CollapsibleSectionProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const contentId = useId();
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const toggle = () => {
    const next = !isOpen;
    if (!isControlled) {
      setInternalOpen(next);
    }
    onOpenChange?.(next);
  };

  return (
    <div
      className={`rounded-lg border transition ${
        highlighted
          ? 'border-sky-400 dark:border-sky-600 bg-sky-50/50 dark:bg-sky-950/20'
          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30'
      } ${className}`}
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className={`w-full flex items-start gap-2 text-left p-4 hover:bg-slate-100/60 dark:hover:bg-slate-900/40 transition rounded-lg ${headerClassName}`}
      >
        <ChevronDown
          className={`h-4 w-4 mt-0.5 shrink-0 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
            isOpen ? '' : '-rotate-90'
          }`}
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0">
          <div>{title}</div>
          {!isOpen && subtitle && (
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{subtitle}</div>
          )}
        </div>
      </button>

      {isOpen && (
        <div id={contentId} className="px-4 pb-4 pt-0 space-y-4 border-t border-slate-200/80 dark:border-slate-700/80">
          {children}
        </div>
      )}
    </div>
  );
}

interface CollapsiblePanelProps {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}

export function CollapsiblePanel({
  title,
  description,
  defaultOpen = true,
  children,
  className = '',
}: CollapsiblePanelProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden ${className}`}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls={contentId}
        className="w-full flex items-start gap-2 text-left p-5 hover:bg-slate-50 dark:hover:bg-slate-950/50 transition"
      >
        <ChevronDown
          className={`h-5 w-5 mt-0.5 shrink-0 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
            open ? '' : '-rotate-90'
          }`}
          aria-hidden="true"
        />
        <div className="flex-1 border-b-0">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">{title}</h2>
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</p>
          )}
        </div>
      </button>

      {open && (
        <div id={contentId} className="px-5 pb-5 pt-0 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}
