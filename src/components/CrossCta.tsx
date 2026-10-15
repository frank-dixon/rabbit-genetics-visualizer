import { useMemo } from 'react';
import { useGeneticStore } from '../store/useGeneticStore';
import { summarizeLitter } from '../utils/litterSummary';

export const SHOW_LITTER_EVENT = 'progeny:show-litter';

const pct = (p: number) => `${(p * 100).toFixed(2).replace(/\.?0+$/, '')}%`;

/** Live preview of the top odds plus the primary action that takes you to the litter. */
export function CrossCta() {
  const parent1 = useGeneticStore((s) => s.parent1);
  const parent2 = useGeneticStore((s) => s.parent2);
  const ready = Object.keys(parent1).length > 0 && Object.keys(parent2).length > 0;
  const top = useMemo(
    () => (ready ? summarizeLitter(parent1, parent2).slice(0, 3) : []),
    [ready, parent1, parent2],
  );

  const showLitter = () => {
    if (window.matchMedia('(min-width: 768px)').matches) {
      document.getElementById('litter-overview')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.dispatchEvent(new Event(SHOW_LITTER_EVENT));
    }
  };

  return (
    <div className="space-y-3 border-t border-rule pt-3">
      {ready && top.length > 0 ? (
        <ul aria-label="Litter preview" className="space-y-1">
          {top.map((kit) => (
            <li key={kit.title} className="flex items-baseline gap-3 text-sm text-ink">
              <span className="headline w-16 shrink-0 text-xl text-teal-deep">{pct(kit.probability)}</span>
              <span className="min-w-0 truncate">{kit.title}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="kicker text-ink-muted">Pick a dam and sire</p>
      )}
      <button
        type="button"
        onClick={showLitter}
        disabled={!ready}
        className="btn-block btn-lichen w-full !py-4 !text-[13px] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="md:hidden">See the litter →</span>
        <span className="hidden md:inline">Predict the litter ↓</span>
      </button>
    </div>
  );
}
