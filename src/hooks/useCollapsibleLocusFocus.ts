import { useEffect, useState } from 'react';

/** Expands automatically when `expandWhen` becomes true; still manually collapsible. */
export function useCollapsibleLocusFocus(expandWhen: boolean) {
  const [open, setOpen] = useState(expandWhen);

  useEffect(() => {
    if (expandWhen) {
      setOpen(true);
    }
  }, [expandWhen]);

  return [open, setOpen] as const;
}
