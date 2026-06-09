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
  parent1Alleles: [string, string],
  parent2Alleles: [string, string],
): Map<string, number> {
  const probabilities = new Map<string, number>();

  for (const gamete1 of parent1Alleles) {
    for (const gamete2 of parent2Alleles) {
      const key = pairKey(locusId, gamete1, gamete2);
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
    return diluted ? 'Cream / pearl' : 'Cream / fawn';
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

function isSilverHeterozygote(pair: [string, string]): boolean {
  return (
    (pair[0] === 'Si' && pair[1] === 'si') || (pair[0] === 'si' && pair[1] === 'Si')
  );
}

function describeSilvering(
  genotypes: GenotypeMap,
  resolved: Record<string, string>,
  baseColor: string,
): string | null {
  if (!genotypes.Si) return null;

  if (isHomozygous(genotypes.Si, 'si')) {
    if (resolved.E === 'e' && resolved.A === 'a') {
      return "Crème d'Argent type — cream/fawn with heavy silvering (sisi)";
    }
    if (resolved.E === 'e' && resolved.A === 'A') {
      return 'Silvered red/fawn — frosted ermine type (A_ ee sisi)';
    }
    if (resolved.A === 'A') {
      return 'Silver breed type — agouti with heavy silvering (sisi)';
    }
    if (resolved.A === 'a') {
      return 'Heavy silvered self — black-born Champagne/Silver Fox type (sisi)';
    }
    return 'Silvered coat (sisi — progressive white tipping)';
  }

  if (isSilverHeterozygote(genotypes.Si)) {
    if (resolved.E === 'e' && resolved.A === 'a') {
      return 'Cream/fawn with light silvering (Sisi)';
    }
    if (resolved.E === 'e' && resolved.A === 'A') {
      return 'Red/fawn with light silvering (Sisi)';
    }
    if (resolved.A === 'A') {
      return `${baseColor} with light silvering (Sisi)`;
    }
    if (resolved.A === 'a') {
      return `${baseColor} with light silvering (Sisi)`;
    }
    return `${baseColor} with light silvering (Sisi)`;
  }

  return null;
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
    const isAlbinoCarrier =
      (genotypes.C[0] === 'c' || genotypes.C[1] === 'c') && !isHomozygous(genotypes.C, 'c');
    parts.push(
      isAlbinoCarrier
        ? 'Himalayan / pointed white (ch/c — often paler points than chch)'
        : 'Himalayan / pointed white (ch_)',
    );
  } else if (resolved.C === 'cchd') {
    parts.push('Chinchilla modifier (cchd_)');
  } else if (resolved.C === 'cchl') {
    parts.push('Shaded / sable modifier (cchl_)');
  }

  const baseColor = baseColorName(resolved, genotypes);
  const silvering = describeSilvering(genotypes, resolved, baseColor);

  if (silvering) {
    parts.push(silvering);
  } else {
    parts.push(baseColor);
  }

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
    const locusProbabilities = getLocusCrossProbabilities(
      locusId,
      parent1[locusId],
      parent2[locusId],
    );
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
