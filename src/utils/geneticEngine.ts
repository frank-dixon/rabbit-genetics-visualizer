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
    if (a === 'A') return diluted ? 'Frosted / ermine' : 'Red / fawn / orange';
    if (a === 'at') return diluted ? 'Lilac otter' : 'Chocolate otter';
    return diluted ? 'Blue tortoiseshell' : 'Tortoiseshell';
  }

  if (e === 'Es' && a === 'A') {
    return diluted ? 'Blue steel' : 'Steel / silver-tipped';
  }

  if (e === 'Ed') {
    return diluted ? (b === 'b' ? 'Lilac' : 'Blue') : b === 'b' ? 'Chocolate' : 'Black';
  }

  if (a === 'a') {
    if (b === 'b') return diluted ? 'Lilac' : 'Chocolate';
    return diluted ? 'Blue' : 'Self black';
  }

  if (a === 'at') {
    return diluted ? 'Blue otter / smoke pearl' : 'Black otter / tan';
  }

  if (a === 'A') {
    return diluted ? 'Opal / blue agouti' : 'Chestnut / agouti';
  }

  return 'Unknown base color';
}

function isSilverHeterozygote(pair: [string, string]): boolean {
  return (
    (pair[0] === 'Si' && pair[1] === 'si') || (pair[0] === 'si' && pair[1] === 'Si')
  );
}

function describeSilvering(
  genotypes: GenotypeMap,
  resolved: Record<string, string>,
  _baseColor: string,
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

  // Sisi: silvering is recessive, so one copy is carried, not shown (see the
  // 'Silvering carrier (Sisi)' part added in resolvePhenotype).
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
    parts.push('Charlie spotting (EnEn)');
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
    parts.push('Vienna carrier (Vv)');
  }

  // Silvering is recessive: Sisi looks non-silvered but can pass si on.
  // OSU Extension notes heterozygotes occasionally show a few silver hairs; we model the usual case.
  if (genotypes.Si && isSilverHeterozygote(genotypes.Si)) {
    parts.push('Silvering carrier (Sisi)');
  }

  return parts.join('; ');
}

export function resolveParentPhenotype(genotypes: GenotypeMap): string {
  return resolvePhenotype(genotypes);
}

/**
 * B (TYRP1) and C (TYR) both sit on rabbit chromosome 1 (OryCun2.0: 41.35 Mb and
 * 127.56 Mb), so they are linked. Castle (1924, PNAS 10:486) counted 35.8%
 * recombinant young among 1,006 backcross kits; we use 0.36 for both sexes.
 * Castle (1936) reports a sex difference (about 43 cM in does, 35 cM in bucks),
 * but those are map distances, not observed rates, and we have not read the
 * paper's full data, so a single sex-averaged rate is the honest choice.
 */
export const BC_RECOMBINATION = 0.36;

/**
 * How a parent's B and C alleles sit on its two chromosome 1 copies.
 * - 'cis':   B[0] travels with C[0] (and B[1] with C[1])
 * - 'trans': B[0] travels with C[1] (and B[1] with C[0])
 * - 'unknown': not known. The average of the two phases is exactly the
 *   unlinked (independent) result, so unknown phase uses plain Punnett odds.
 */
export type BCPhase = 'unknown' | 'cis' | 'trans';

export interface CrossOptions {
  phase?: { parent1?: BCPhase; parent2?: BCPhase };
  recombination?: number;
}

/** True when a parent is mixed at both B and C, the only case where its phase changes the odds. */
export function isBCDoubleHet(genotype: GenotypeMap): boolean {
  const b = genotype.B;
  const c = genotype.C;
  return Boolean(b && c && b[0] !== b[1] && c[0] !== c[1]);
}

/** Gamete frequencies for a parent's B–C haplotype, keyed "B-allele|C-allele". */
export function bcGametes(
  genotype: GenotypeMap,
  phase: BCPhase = 'unknown',
  recombination: number = BC_RECOMBINATION,
): Map<string, number> {
  const [b0, b1] = genotype.B;
  const [c0, c1] = genotype.C;
  const out = new Map<string, number>();
  const add = (b: string, c: string, p: number) => {
    const key = `${b}|${c}`;
    out.set(key, (out.get(key) ?? 0) + p);
  };
  if (phase === 'unknown') {
    for (const b of [b0, b1]) for (const c of [c0, c1]) add(b, c, 0.25);
    return out;
  }
  const pc = phase === 'cis' ? [c0, c1] : [c1, c0];
  const parental = (1 - recombination) / 2;
  const recomb = recombination / 2;
  add(b0, pc[0], parental);
  add(b1, pc[1], parental);
  add(b0, pc[1], recomb);
  add(b1, pc[0], recomb);
  return out;
}

/** Joint offspring distribution over the B and C pairs, keyed "Bpair|Cpair". */
function getBCCrossProbabilities(
  parent1: GenotypeMap,
  parent2: GenotypeMap,
  options: CrossOptions,
): { genotypes: GenotypeMap; probability: number }[] {
  const r = options.recombination ?? BC_RECOMBINATION;
  const g1 = bcGametes(parent1, options.phase?.parent1 ?? 'unknown', r);
  const g2 = bcGametes(parent2, options.phase?.parent2 ?? 'unknown', r);
  const merged = new Map<string, { genotypes: GenotypeMap; probability: number }>();
  for (const [k1, p1] of g1) {
    const [b1, c1] = k1.split('|');
    for (const [k2, p2] of g2) {
      const [b2, c2] = k2.split('|');
      const bKey = pairKey('B', b1, b2);
      const cKey = pairKey('C', c1, c2);
      const key = `${bKey}|${cKey}`;
      const existing = merged.get(key);
      if (existing) existing.probability += p1 * p2;
      else
        merged.set(key, {
          genotypes: { B: parsePairKey('B', bKey), C: parsePairKey('C', cKey) },
          probability: p1 * p2,
        });
    }
  }
  return [...merged.values()];
}

export function calculateCross(
  parent1: Record<string, [string, string]>,
  parent2: Record<string, [string, string]>,
  options: CrossOptions = {},
): ProgenyOutcome[] {
  const activeLoci = LOCI_ORDER.filter(
    (locusId) => parent1[locusId] && parent2[locusId] && RABBIT_GENETIC_MAP[locusId],
  );
  const linked = activeLoci.includes('B') && activeLoci.includes('C');

  let outcomes: { genotypes: GenotypeMap; probability: number }[] = [{ genotypes: {}, probability: 1 }];

  for (const locusId of activeLoci) {
    if (linked && locusId === 'C') continue;
    if (linked && locusId === 'B') {
      const joint = getBCCrossProbabilities(parent1, parent2, options);
      outcomes = outcomes.flatMap((o) =>
        joint.map((j) => ({
          genotypes: { ...o.genotypes, ...j.genotypes },
          probability: o.probability * j.probability,
        })),
      );
      continue;
    }
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
