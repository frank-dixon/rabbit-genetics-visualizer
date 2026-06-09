import { useMemo } from 'react';
import { resolvePhenotypeVisual, type PhenotypeVisual } from '../utils/phenotypeVisual';

type GenotypeMap = Record<string, [string, string]>;

const EYE_COLORS = {
  ruby: { iris: '#ef4444', glow: '#fca5a5' },
  blue: { iris: '#38bdf8', glow: '#7dd3fc' },
  pink: { iris: '#fb7185', glow: '#fda4af' },
  dark: { iris: '#422006', glow: '#1c1917' },
} as const;

const SIZE_MAP = {
  sm: 'w-20 h-14',
  md: 'w-32 h-24',
  lg: 'w-44 h-32',
} as const;

const SILVER_SPECKS = [
  [28, 38],
  [42, 44],
  [55, 36],
  [48, 52],
  [62, 46],
  [70, 38],
  [36, 50],
  [58, 58],
  [74, 50],
  [44, 62],
  [66, 42],
  [52, 48],
];

interface PhenotypeRendererProps {
  genotype: GenotypeMap;
  size?: keyof typeof SIZE_MAP;
  className?: string;
  label?: string;
}

function RabbitSvg({ visual }: { visual: PhenotypeVisual }) {
  const eyes = EYE_COLORS[visual.eyeColor];
  const showBelly = visual.pattern === 'agouti' || visual.pattern === 'solid';
  const showPoints = visual.pattern === 'pointed' && visual.pointColor;
  const showBroken = visual.pattern === 'broken' && visual.patchColor;
  const showCharlie = visual.pattern === 'charlie' && visual.patchColor;

  return (
    <svg viewBox="0 0 120 80" className="w-full h-full" aria-hidden="true">
      <ellipse cx="58" cy="52" rx="34" ry="22" fill={visual.bodyColor} />
      {showBelly && visual.pattern !== 'white' && (
        <ellipse cx="58" cy="58" rx="20" ry="12" fill={visual.bellyColor} opacity="0.9" />
      )}

      {showBroken && (
        <>
          <ellipse cx="42" cy="48" rx="14" ry="10" fill={visual.patchColor!} />
          <ellipse cx="68" cy="54" rx="12" ry="9" fill={visual.patchColor!} />
          <ellipse cx="54" cy="42" rx="10" ry="8" fill={visual.patchColor!} />
        </>
      )}

      {showCharlie && (
        <>
          <ellipse cx="48" cy="50" rx="6" ry="5" fill={visual.patchColor!} />
          <ellipse cx="66" cy="56" rx="5" ry="4" fill={visual.patchColor!} />
        </>
      )}

      {visual.silvering > 0 &&
        SILVER_SPECKS.map(([cx, cy], index) => (
          <circle
            key={index}
            cx={cx}
            cy={cy}
            r={2 + (index % 2)}
            fill="#ffffff"
            opacity={visual.silvering * 0.85}
          />
        ))}

      {visual.steelTips && (
        <ellipse cx="58" cy="44" rx="30" ry="6" fill="#e2e8f0" opacity="0.45" />
      )}

      <circle cx="82" cy="36" r="16" fill={visual.pattern === 'pointed' ? '#f8fafc' : visual.bodyColor} />
      <ellipse cx="74" cy="18" rx="7" ry="16" fill={showPoints ? visual.pointColor! : visual.bodyColor} />
      <ellipse cx="90" cy="18" rx="7" ry="16" fill={showPoints ? visual.pointColor! : visual.bodyColor} />

      {showPoints && (
        <>
          <ellipse cx="82" cy="42" rx="5" ry="4" fill={visual.pointColor!} />
          <ellipse cx="52" cy="68" rx="6" ry="4" fill={visual.pointColor!} />
          <ellipse cx="64" cy="68" rx="6" ry="4" fill={visual.pointColor!} />
        </>
      )}

      <circle cx="78" cy="35" r="4.5" fill={eyes.glow} />
      <circle cx="88" cy="35" r="4.5" fill={eyes.glow} />
      <circle cx="78" cy="35" r="2.8" fill={eyes.iris} />
      <circle cx="88" cy="35" r="2.8" fill={eyes.iris} />
      <circle cx="79" cy="34" r="0.8" fill="#ffffff" opacity="0.7" />
      <circle cx="89" cy="34" r="0.8" fill="#ffffff" opacity="0.7" />
    </svg>
  );
}

export function PhenotypeRenderer({
  genotype,
  size = 'md',
  className = '',
  label,
}: PhenotypeRendererProps) {
  const visual = useMemo(() => resolvePhenotypeVisual(genotype), [genotype]);

  return (
    <div
      className={`rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 overflow-hidden ${SIZE_MAP[size]} ${className}`}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      <RabbitSvg visual={visual} />
    </div>
  );
}
