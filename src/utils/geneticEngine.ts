import { LOCI_ORDER, RABBIT_GENETIC_MAP } from '../data/rabbitGenetics';

export interface ProgenyOutcome {
  genotype: string;
  genotypeByLocus: Record<string, [string, string]>;
  phenotype: string;
  probability: number;
}

type GenotypeMap = Record<string, [string, string]>;

function dominanceRank(locusId: string, allele: string): number {
  const hierarchy = RABBIT_GENETIC_MAP[locusId]?.dominanceHierarchy ?? [];
  const index = hierarchy.indexOf(allele);
  return index === -1 ? hierarchy.length : index;
}

function sortAllelePair(locusId: string, alleleA: string, alleleB: string): [string, string] {
  return dominanceRank(locusId, alleleA) <= dominanceRank(locusId, alleleB)
    ? [alleleA, alleleB]
    : [alleleB, alleleA];
}

function pairKey(locusId: string, alleleA: string, alleleB: string): string {
  const [first, second] = sortAllelePair(locusId, alleleA, alleleB);
  return `${first}/${second}`;
}

function parsePairKey(locusId: string, key: string): [string, string] {
  const [first, second] = key.split('/');
  return sortAllelePair(locusId, first, second);
}

function getLocusCrossProbabilities(
  locusId: string,
  parentAlleles: [string, string],
): Map<string, number> {
  const probabilities = new Map<string, number>();

  for (const g1 of [parentAlleles[0], parentAlleles[1]]) {
    for (const g2 of [parentAlleles[0], parentAlleles[1]]) {
      const key = pairKey(locusId, g1, g2);
      probabilities.set(key, (probabilities.get(key) ?? 0) + 0.25);
    }
  }

  return probabilities;
}

function combineOutcomes(
  current: { genotypes: GenotypeMap; probability: number }[],
  locusId: string,
  locusProbabilities: Map<string, number>,
): { genotypes: GenotypeMap; probability: number }[] {
  const next: { genotypes: GenotypeMap; probability: number }[] = [];

  for (const outcome of current) {
    for (const [key, locusProbability] of locusProbabilities) {
      next.push({
        genotypes: {
          ...outcome.genotypes,
          [locusId]: parsePairKey(locusId, key),
        },
        probability: outcome.probability * locusProbability,
      });
    }
  }

  return next;
}

function mergeOutcomes(
  outcomes: { genotypes: GenotypeMap; probability: number }[],
): { genotypes: GenotypeMap; probability: number }[] {
  const merged = new Map<string, { genotypes: GenotypeMap; probability: number }>();

  for (const outcome of outcomes) {
    const key = LOCI_ORDER.map((locusId) => {
      const pair = outcome.genotypes[locusId];
      return pair ? pairKey(locusId, pair[0], pair[1]) : '?/?';
    }).join('|');

    const existing = merged.get(key);
    if (existing) {
      existing.probability += outcome.probability;
    } else {
      merged.set(key, { genotypes: outcome.genotypes, probability: outcome.probability });
    }
  }

  return [...merged.values()].sort((a, b) => b.probability - a.probability);
}

function formatGenotypeLabel(genotypes: GenotypeMap): string {
  return LOCI_ORDER.filter((locusId) => genotypes[locusId])
    .map((locusId) => {
      const [a, b] = genotypes[locusId];
      return a === b ? `${locusId}:${a}` : `${locusId}:${a}/${b}`;
    })
    .join(' · ');
}

function isHomozygous(pair: [string, string], allele: string): boolean {
  return pair[0] === allele && pair[1] === allele;
}

function resolvedAllele(locusId: string, pair: [string, string]): string {
  return sortAllelePair(locusId, pair[0], pair[1])[0];
}

function baseColorName(
  resolved: Record<string, string>,
  genotypes: GenotypeMap,
): string {
  const a = resolved.A;
  const b = resolved.B;
  const d = resolved.D;
  const e = resolved.E;
  const diluted = d === 'd' && isHomozygous(genotypes.D, 'd');

  if (e === 'e') {
    if (a === 'A') return diluted ? 'Frosted / ermine (draft)' : 'Red / fawn / orange';
    if (a === 'at') return diluted ? 'Lilac otter (draft)' : 'Chocolate otter (draft)';
    return diluted ? 'Cream / pearl (draft)' : 'Red-eyed orange (draft)';
  }

  if (e === 'Es' && a === 'A') {
    return diluted ? 'Blue steel (draft)' : 'Steel / silver-tipped (draft)';
  }

  if (e === 'Ed') {
    return diluted ? (b === 'b' ? 'Lilac (draft)' : 'Blue (draft)') : b === 'b' ? 'Chocolate' : 'Black';
  }

  if (a === 'a') {
    if (b === 'b') return diluted ? 'Lilac' : 'Chocolate';
    return diluted ? 'Blue' : 'Self black';
  }

  if (a === 'at') {
    return diluted ? 'Blue otter / smoke pearl (draft)' : 'Black otter / tan (draft)';
  }

  if (a === 'A') {
    return diluted ? 'Opal / blue agouti (draft)' : 'Chestnut / agouti';
  }

  return 'Unknown base color (draft)';
}

function resolvePhenotype(genotypes: GenotypeMap): string {
  const resolved = Object.fromEntries(
    LOCI_ORDER.filter((id) => genotypes[id]).map((id) => [id, resolvedAllele(id, genotypes[id])]),
  ) as Record<string, string>;

  // REVIEW: Frank — verify rule: homozygous cc masks all coat color loci (REW)
  if (isHomozygous(genotypes.C, 'c')) {
    return 'Ruby-Eyed White (albino — cc epistasis)';
  }

  // REVIEW: Frank — verify rule: homozygous vv produces BEW (distinct from REW)
  if (isHomozygous(genotypes.V, 'v')) {
    return 'Blue-Eyed White (Vienna — vv)';
  }

  const parts: string[] = [];

  if (resolved.C === 'ch') {
    parts.push('Himalayan / pointed white (ch_)');
  } else if (resolved.C === 'cchd') {
    parts.push('Chinchilla modifier (cchd_)');
  } else if (resolved.C === 'cchl') {
    parts.push('Shaded / sable modifier (cchl_)');
  }

  parts.push(baseColorName(resolved, genotypes));

  if (isHomozygous(genotypes.En, 'En')) {
    parts.push('Charlie spotting (EnEn — draft)');
  } else if (
    (genotypes.En[0] === 'En' && genotypes.En[1] === 'en') ||
    (genotypes.En[0] === 'en' && genotypes.En[1] === 'En')
  ) {
    parts.push('Broken / spotted (Enen)');
  }

  if (
    (genotypes.V[0] === 'V' && genotypes.V[1] === 'v') ||
    (genotypes.V[0] === 'v' && genotypes.V[1] === 'V')
  ) {
    parts.push('Vienna carrier (Vv — draft)');
  }

  if (genotypes.Si && isHomozygous(genotypes.Si, 'si')) {
    parts.push('Silvered coat (sisi — progressive white tipping)');
  } else if (
    genotypes.Si &&
    ((genotypes.Si[0] === 'Si' && genotypes.Si[1] === 'si') ||
      (genotypes.Si[0] === 'si' && genotypes.Si[1] === 'Si'))
  ) {
    parts.push('Light silver carrier (Sisi — draft)');
  }

  return parts.join('; ');
}

export function resolveParentPhenotype(genotypes: GenotypeMap): string {
  return resolvePhenotype(genotypes);
}

export function calculateCross(
  parent1: Record<string, [string, string]>,
  parent2: Record<string, [string, string]>,
): ProgenyOutcome[] {
  const activeLoci = LOCI_ORDER.filter(
    (locusId) => parent1[locusId] && parent2[locusId] && RABBIT_GENETIC_MAP[locusId],
  );

  let outcomes: { genotypes: GenotypeMap; probability: number }[] = [{ genotypes: {}, probability: 1 }];

  for (const locusId of activeLoci) {
    const locusProbabilities = getLocusCrossProbabilities(locusId, parent1[locusId]);
    outcomes = combineOutcomes(outcomes, locusId, locusProbabilities);
  }

  return mergeOutcomes(outcomes).map((outcome) => ({
    genotype: formatGenotypeLabel(outcome.genotypes),
    genotypeByLocus: outcome.genotypes,
    phenotype: resolvePhenotype(outcome.genotypes),
    probability: outcome.probability,
  }));
}

export function formatProbability(probability: number): string {
  return `${(probability * 100).toFixed(1)}%`;
}
