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
      <p className="text-[10px] text-center text-slate-500 dark:text-slate-400">
        Parents match at all loci — uniform progeny expected.
      </p>
    );
  }

  return (
    <p className="text-[10px] text-center text-slate-500 dark:text-slate-400">
      Varying loci:{' '}
      <span className="font-mono font-semibold text-amber-700 dark:text-amber-300">
        {differingLoci.join(' · ')}
      </span>
    </p>
  );
}
