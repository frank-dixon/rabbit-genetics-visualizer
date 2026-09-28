import { useMemo } from 'react';
import { resolvePhenotypeVisual, type PhenotypeVisual } from '../utils/phenotypeVisual';

type GenotypeMap = Record<string, [string, string]>;

const EYE_COLORS = {
  ruby: { iris: '#c81e1e', ring: '#fca5a5' },
  blue: { iris: '#2563eb', ring: '#93c5fd' },
  pink: { iris: '#db2777', ring: '#f9a8d4' },
  dark: { iris: '#1c1917', ring: '#57534e' },
} as const;

const SIZE_MAP = {
  sm: 'w-16 h-12',
  md: 'w-28 h-20',
  lg: 'w-40 h-28',
} as const;

const EYE_SIZE = {
  sm: 'h-2.5 w-2.5',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
} as const;

interface PhenotypeRendererProps {
  genotype: GenotypeMap;
  size?: keyof typeof SIZE_MAP;
  className?: string;
  label?: string;
}

function FurSwatch({ visual, size }: { visual: PhenotypeVisual; size: keyof typeof SIZE_MAP }) {
  const eyes = EYE_COLORS[visual.eyeColor];
  const showBellyBand = visual.pattern === 'agouti' || visual.pattern === 'solid';
  const showPoints = visual.pattern === 'pointed' && visual.pointColor;
  const showBroken = visual.pattern === 'broken' && visual.patchColor;
  const showCharlie = visual.pattern === 'charlie' && visual.patchColor;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-md">
      {/* Base coat with fur texture */}
      <div
        className="fur-swatch absolute inset-0"
        style={{ backgroundColor: visual.bodyColor }}
      />

      {showBellyBand && visual.pattern !== 'white' && (
        <div
          className="fur-swatch absolute inset-x-0 bottom-0 h-[42%] opacity-90"
          style={{ backgroundColor: visual.bellyColor }}
        />
      )}

      {showBroken && (
        <>
          <div
            className="fur-swatch absolute left-[8%] top-[18%] h-[48%] w-[38%] rounded-[40%_55%_45%_50%] opacity-95"
            style={{ backgroundColor: visual.patchColor! }}
          />
          <div
            className="fur-swatch absolute right-[10%] bottom-[12%] h-[36%] w-[32%] rounded-[50%_40%_55%_45%] opacity-95"
            style={{ backgroundColor: visual.patchColor! }}
          />
        </>
      )}

      {showCharlie && (
        <>
          <div
            className="fur-swatch absolute left-[22%] top-[28%] h-[22%] w-[18%] rounded-full opacity-90"
            style={{ backgroundColor: visual.patchColor! }}
          />
          <div
            className="fur-swatch absolute right-[24%] bottom-[22%] h-[18%] w-[14%] rounded-full opacity-90"
            style={{ backgroundColor: visual.patchColor! }}
          />
        </>
      )}

      {showPoints && (
        <>
          <div
            className="fur-swatch absolute left-0 top-0 h-[28%] w-[22%] rounded-br-xl opacity-95"
            style={{ backgroundColor: visual.pointColor! }}
          />
          <div
            className="fur-swatch absolute right-0 top-0 h-[28%] w-[22%] rounded-bl-xl opacity-95"
            style={{ backgroundColor: visual.pointColor! }}
          />
          <div
            className="fur-swatch absolute inset-x-[28%] bottom-0 h-[18%] opacity-95"
            style={{ backgroundColor: visual.pointColor! }}
          />
        </>
      )}

      {visual.silvering > 0 && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: visual.silvering,
            backgroundImage:
              'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.85) 0 1px, transparent 2px), radial-gradient(circle at 55% 45%, rgba(255,255,255,0.75) 0 1px, transparent 2px), radial-gradient(circle at 75% 25%, rgba(255,255,255,0.7) 0 1.5px, transparent 2.5px), radial-gradient(circle at 35% 70%, rgba(255,255,255,0.8) 0 1px, transparent 2px), radial-gradient(circle at 68% 68%, rgba(255,255,255,0.65) 0 1px, transparent 2px)',
            backgroundSize: '14px 14px, 18px 18px, 16px 16px, 20px 20px, 15px 15px',
          }}
        />
      )}

      {visual.steelTips && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[35%] opacity-50"
          style={{
            background:
              'linear-gradient(180deg, rgba(226,232,240,0.75) 0%, transparent 100%)',
          }}
        />
      )}

      {/* Eye color dots (not cartoon rabbit art) */}
      <div className="absolute bottom-1 right-1 flex items-center gap-1 rounded-full bg-black/15 px-1 py-0.5 backdrop-blur-[1px]">
        <span
          className={`inline-block rounded-full ring-1 ring-white/70 shadow-sm ${EYE_SIZE[size]}`}
          style={{
            background: `radial-gradient(circle at 35% 30%, #fff 0 18%, ${eyes.iris} 28% 72%, ${eyes.ring} 100%)`,
          }}
          title={`Eyes: ${visual.eyeColor}`}
        />
        <span
          className={`inline-block rounded-full ring-1 ring-white/70 shadow-sm ${EYE_SIZE[size]}`}
          style={{
            background: `radial-gradient(circle at 35% 30%, #fff 0 18%, ${eyes.iris} 28% 72%, ${eyes.ring} 100%)`,
          }}
          aria-hidden="true"
        />
      </div>
    </div>
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
      className={`rounded-md border border-rule/80 dark:border-rule-dark/70 bg-paper-2/60 dark:bg-espresso/60 overflow-hidden ${SIZE_MAP[size]} ${className}`}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      <FurSwatch visual={visual} size={size} />
    </div>
  );
}
