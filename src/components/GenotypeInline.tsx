import { useMemo } from 'react';
import { buildGenotypeSegments } from '../utils/formatGenotype';

type GenotypeMap = Record<string, [string, string]>;

interface GenotypeInlineProps {
  genotype: GenotypeMap;
  baseline?: GenotypeMap;
}

export function GenotypeInline({ genotype, baseline }: GenotypeInlineProps) {
  const segments = useMemo(
    () => buildGenotypeSegments(genotype, baseline),
    [genotype, baseline],
  );

  return (
    <p className="text-[10px] font-mono leading-relaxed">
      {segments.map((segment, index) => (
        <span key={segment.locusId}>
          {index > 0 && (
            <span className="text-slate-400 dark:text-slate-600"> · </span>
          )}
          <span
            className={
              segment.isDifferent
                ? 'text-amber-600 dark:text-amber-300 font-semibold'
                : 'text-slate-500 dark:text-slate-400'
            }
          >
            {segment.text}
          </span>
        </span>
      ))}
    </p>
  );
}
