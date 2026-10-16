import type { ReactNode } from 'react';

/** OryCun2.0 (Ensembl) positions, in Mb. Chromosome 1 is 194.85 Mb long. */
export const OCU1_MB = 194.85;
export const B_MB = 41.35;
export const C_MB = 127.56;
/** Illustrative crossover spot between B and C (not a measured hotspot). */
export const CROSS_MB = 84;

export const DOE = '#F3D9CC';
export const DOE2 = '#E7B49B';
export const BUCK = '#D5DDF0';
const INK = '#13203B';
const BUTTER = '#F5D76E';

interface ChromoProps {
  b: string;
  c: string;
  fill: string;
  /** Colour of the swapped end, from the crossover point to the tip. */
  swap?: string;
  label?: string;
  caption?: ReactNode;
  showCross?: boolean;
}

/** One chromosome 1 copy, drawn to scale, with B and C at their real positions. */
export function Chromo({ b, c, fill, swap, label, caption, showCross }: ChromoProps) {
  const W = 420;
  const x0 = 6;
  const w = W - 12;
  const y = 24;
  const at = (mb: number) => x0 + (mb / OCU1_MB) * w;
  const stripes = Array.from({ length: 13 }, (_, i) => x0 + ((i + 1) * w) / 14);
  return (
    <figure className="m-0">
      {label && <figcaption className="kicker mb-0.5 text-[10.5px] text-ink-muted">{label}</figcaption>}
      <svg viewBox={`0 0 ${W} 58`} className="block w-full" role="img" aria-label={`Chromosome 1 carrying ${b} and ${c}`}>
        <clipPath id={`clip-${b}-${c}-${fill}-${swap ?? ''}`}>
          <rect x={x0} y={y} width={w} height={24} rx={12} />
        </clipPath>
        <g clipPath={`url(#clip-${b}-${c}-${fill}-${swap ?? ''})`}>
          <rect x={x0} y={y} width={w} height={24} fill={fill} />
          {swap && <rect x={at(CROSS_MB)} y={y} width={x0 + w - at(CROSS_MB)} height={24} fill={swap} />}
          {stripes.map((sx) => (
            <rect key={sx} x={sx} y={y} width={w / 60} height={24} fill={INK} opacity={0.1} />
          ))}
        </g>
        <rect x={x0} y={y} width={w} height={24} rx={12} fill="none" stroke={INK} strokeWidth={1.5} />
        {showCross && (
          <line x1={at(CROSS_MB)} y1={y - 6} x2={at(CROSS_MB)} y2={y + 30} stroke={INK} strokeWidth={2} strokeDasharray="4 3" />
        )}
        {[
          [B_MB, b],
          [C_MB, c],
        ].map(([mb, t]) => (
          <g key={String(mb)}>
            <rect x={at(mb as number) - 4} y={y - 3} width={8} height={30} fill={BUTTER} stroke={INK} />
            <text x={at(mb as number)} y={y - 7} textAnchor="middle" fontSize={16} fontWeight={600} fill={INK} className="font-mono">
              {t}
            </text>
          </g>
        ))}
      </svg>
      {caption && <p className="mt-0.5 font-mono text-[12px] text-ink-muted">{caption}</p>}
    </figure>
  );
}

export function Ruler() {
  const W = 420;
  const x0 = 6;
  const w = W - 12;
  return (
    <svg viewBox={`0 0 ${W} 28`} className="block w-full" aria-hidden>
      <line x1={x0} y1={6} x2={x0 + w} y2={6} stroke="#C5CBD8" />
      {[0, 50, 100, 150].map((mb) => {
        const x = x0 + (mb / OCU1_MB) * w;
        return (
          <g key={mb}>
            <line x1={x} y1={2} x2={x} y2={10} stroke="#C5CBD8" />
            <text x={x} y={22} fontSize={14} textAnchor={mb === 0 ? 'start' : 'middle'} fill="#525C72" className="font-mono">
              {mb} Mb
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function Bar({ k, v, max, butter }: { k: ReactNode; v: number; max: number; butter?: boolean }) {
  return (
    <div className="my-1 flex items-center gap-2.5 text-[14px]">
      <span className="w-28 shrink-0 font-mono text-[13px] sm:w-36">{k}</span>
      <span className="h-5 flex-1 bg-paper-2">
        <span className="block h-5" style={{ width: `${Math.min(100, (v / max) * 100)}%`, background: butter ? BUTTER : '#1E2E55' }} />
      </span>
      <span className="w-16 text-right font-mono">{fmtPct(v)}</span>
    </div>
  );
}

export function fmtPct(v: number): string {
  return `${Number(v.toFixed(3))}%`;
}

export function Lab({ children }: { children: ReactNode }) {
  return <h4 className="kicker mb-2 mt-5 text-[11px] text-ink-muted first:mt-0">{children}</h4>;
}

export function Callout({ children }: { children: ReactNode }) {
  return <div className="mt-4 border-l-4 border-[#1E2E55] bg-paper-2 px-3.5 py-3 text-[14.5px] leading-relaxed">{children}</div>;
}

export function Unc({ children }: { children: ReactNode }) {
  return <span className="border border-dashed border-ink-muted bg-paper-2 px-1 font-mono text-[11px] text-ink-muted">{children}</span>;
}

export function SourceNote({ children }: { children: ReactNode }) {
  return <p className="mt-4 border-t border-rule pt-2.5 text-[12.5px] leading-snug text-ink-muted">{children}</p>;
}

interface StepperProps {
  kicker: string;
  titles: string[];
  step: number;
  onStep: (n: number) => void;
  copy: ReactNode;
  fig: ReactNode;
  id: string;
}

/** Two-column step layout (copy | figure) that stacks on small screens. */
export function Stepper({ kicker, titles, step, onStep, copy, fig, id }: StepperProps) {
  return (
    <div className="border border-rule">
      <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="border-b border-rule p-5 lg:border-b-0 lg:border-r lg:p-6">
          <p className="kicker text-[11px] text-ink-muted">
            {kicker} · step {step + 1} of {titles.length}
          </p>
          <h4 id={`${id}-title`} className="mt-2 text-[24px] font-bold leading-[1.08] tracking-[-0.02em] sm:text-[28px]">
            {titles[step]}
          </h4>
          <div className="mt-2 space-y-2.5 text-[16px] leading-normal [&_b]:font-semibold">{copy}</div>
          <div className="mt-5 flex gap-1.5" role="tablist" aria-label={`${kicker} steps`}>
            {titles.map((t, i) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={i === step}
                aria-label={`Step ${i + 1}: ${t}`}
                onClick={() => onStep(i)}
                className={`h-2 flex-1 ${i <= step ? 'bg-ink' : 'bg-rule'}`}
              />
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button type="button" disabled={step === 0} onClick={() => onStep(step - 1)} className="btn-block btn-outline !px-3 !py-2 text-ink disabled:opacity-40">
              ← Back
            </button>
            <button
              type="button"
              disabled={step === titles.length - 1}
              onClick={() => onStep(step + 1)}
              className="btn-block btn-forest !px-3 !py-2 disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>
        <div className="min-w-0 p-5 lg:p-6">{fig}</div>
      </div>
    </div>
  );
}
