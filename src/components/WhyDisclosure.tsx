import type { ReactNode } from 'react';

/** Small inline disclosure for the deeper genetics ("Why? See the genetics"). */
export function WhyDisclosure({ label = 'Why? See the genetics', children }: { label?: string; children: ReactNode }) {
  return (
    <details className="why group mt-4 border-t border-rule">
      <summary className="kicker flex cursor-pointer list-none items-center gap-2 py-3 text-[11px] text-teal-deep [&::-webkit-details-marker]:hidden">
        <span aria-hidden className="inline-block w-3 group-open:hidden">+</span>
        <span aria-hidden className="hidden w-3 group-open:inline-block">−</span>
        {label}
      </summary>
      <div className="space-y-3 pb-4 text-[15px] leading-relaxed text-ink-soft">{children}</div>
    </details>
  );
}
