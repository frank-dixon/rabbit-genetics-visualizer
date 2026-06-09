import { useMemo } from 'react';
import { useGeneticStore } from '../store/useGeneticStore';
import { getDifferingLoci } from '../utils/parentGenotypeDiff';

export function ParentDiffStrip() {
  const parent1 = useGeneticStore((state) => state.parent1);
  const parent2 = useGeneticStore((state) => state.parent2);

  const differingLoci = useMemo(
    () => getDifferingLoci(parent1, parent2),
    [parent1, parent2],
  );

  if (differingLoci.length === 0) {
    return (
      <p className="text-[10px] text-center text-slate-500 dark:text-slate-400 px-2">
        Parents match at all loci — progeny will be uniform for this cross.
      </p>
    );
  }

  return (
    <div className="rounded-md border border-amber-200/80 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/20 px-3 py-2 text-center">
      <p className="text-[10px] text-amber-900 dark:text-amber-200">
        <span className="font-semibold">Differing loci:</span>{' '}
        {differingLoci.map((locusId, index) => (
          <span key={locusId}>
            {index > 0 && ' · '}
            <span className="font-mono font-bold text-amber-700 dark:text-amber-300">
              {locusId}
            </span>
          </span>
        ))}
        <span className="text-amber-800/80 dark:text-amber-300/80">
          {' '}
          — these drive variation in progeny
        </span>
      </p>
    </div>
  );
}
