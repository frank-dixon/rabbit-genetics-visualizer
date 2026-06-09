import { LOCI_ORDER } from '../data/rabbitGenetics';

type GenotypeMap = Record<string, [string, string]>;

function allelePairsEqual(a: [string, string], b: [string, string]): boolean {
  return (
    (a[0] === b[0] && a[1] === b[1]) || (a[0] === b[1] && a[1] === b[0])
  );
}

export function lociDiffer(
  parent1: GenotypeMap,
  parent2: GenotypeMap,
  locusId: string,
): boolean {
  const pair1 = parent1[locusId];
  const pair2 = parent2[locusId];
  if (!pair1 || !pair2) return false;
  return !allelePairsEqual(pair1, pair2);
}

export function getDifferingLoci(parent1: GenotypeMap, parent2: GenotypeMap): string[] {
  return LOCI_ORDER.filter((locusId) => lociDiffer(parent1, parent2, locusId));
}
