import { useMemo } from 'react';
import { deriveCoat, type HairBand } from '../utils/coatBands';

type GenotypeMap = Record<string, [string, string]>;

/**
 * "Hair A, Banded bar": one hair laid flat, root on the left, tip pointing right,
 * band widths to scale. `labeled` adds band names under it (card size).
 */
export function HairBar({ genotype, labeled = false, className = '' }: { genotype: GenotypeMap; labeled?: boolean; className?: string }) {
  const coat = useMemo(() => deriveCoat(genotype), [genotype]);
  const showSecondary = coat.pattern === 'pointed' && coat.secondary;
  const hairs: [string, HairBand[]][] = showSecondary
    ? [['Body', coat.bands], ['Points', coat.secondary!]]
    : [['', coat.bands]];
  const text = hairs.map(([k, b]) => `${k ? `${k} hair` : 'Hair'}, root to tip: ${b.map((x) => `${x.label} ${Math.round(x.frac * 100)}%`).join(', ')}`).join('. ');
  return (
    <div className={className} role="img" aria-label={text}>
      {hairs.map(([k, bands]) => (
        <div key={k} className={labeled && k ? 'mt-1.5 first:mt-0' : ''}>
          {labeled && k && <p className="kicker text-[9px] text-ink-muted">{k}</p>}
          <div
            className={`flex overflow-hidden ${labeled ? 'h-4' : 'h-2.5'}`}
            style={{
              clipPath: 'polygon(0 0, calc(100% - 7px) 0, 100% 50%, calc(100% - 7px) 100%, 0 100%)',
              boxShadow: 'inset 0 0 0 1px rgba(19,32,59,.35)',
            }}
          >
            {bands.map((b, i) => (
              <span key={i} style={{ flex: `${b.frac} 0 0`, background: b.color, borderRight: i < bands.length - 1 ? '1px solid rgba(19,32,59,.25)' : undefined }} />
            ))}
          </div>
          {labeled && (
            <div className="mt-1 flex text-[11px] leading-tight text-ink-soft" aria-hidden>
              {bands.map((b, i) => (
                <span key={i} className="min-w-0 pr-1" style={{ flex: `${b.frac} 0 0` }}>
                  {b.label}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
      {labeled && (
        <div className="mt-0.5 flex justify-between font-mono text-[9px] uppercase tracking-wider text-ink-muted" aria-hidden>
          <span>Root</span>
          <span>Tip →</span>
        </div>
      )}
    </div>
  );
}
