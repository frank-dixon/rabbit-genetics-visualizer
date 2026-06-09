import { LOCI_ORDER } from '../data/rabbitGenetics';

type GenotypeMap = Record<string, [string, string]>;

export interface GenotypeLocusSegment {
  locusId: string;
  text: string;
  isDifferent: boolean;
}

function formatLocusPair(locusId: string, pair: [string, string]): string {
  const [a, b] = pair;
  return a === b ? `${locusId}:${a}` : `${locusId}:${a}/${b}`;
}

function allelePairsEqual(a: [string, string], b: [string, string]): boolean {
  return (
    (a[0] === b[0] && a[1] === b[1]) || (a[0] === b[1] && a[1] === b[0])
  );
}

export function formatCompactGenotype(genotype: GenotypeMap): string {
  return LOCI_ORDER.filter((locusId) => genotype[locusId])
    .map((locusId) => formatLocusPair(locusId, genotype[locusId]))
    .join(' · ');
}

export function buildGenotypeSegments(
  genotype: GenotypeMap,
  baseline?: GenotypeMap,
): GenotypeLocusSegment[] {
  return LOCI_ORDER.filter((locusId) => genotype[locusId]).map((locusId) => {
    const pair = genotype[locusId];
    const baselinePair = baseline?.[locusId];
    const isDifferent = Boolean(baselinePair && !allelePairsEqual(pair, baselinePair));

    return {
      locusId,
      text: formatLocusPair(locusId, pair),
      isDifferent,
    };
  });
}
