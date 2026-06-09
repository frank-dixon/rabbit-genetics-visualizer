import type { LearnLocusPreset } from '../data/learnLoci';

export interface PunnettCell {
  alleles: [string, string];
  label: string;
  probability: number;
  phenotype: string;
}

export interface PunnettOutcome {
  label: string;
  phenotype: string;
  probability: number;
}

export interface PunnettSquareResult {
  rowGametes: string[];
  colGametes: string[];
  cells: PunnettCell[][];
  outcomes: PunnettOutcome[];
  phenotypeOutcomes: PunnettOutcome[];
  ratioLabel: string;
}

function sortAllelePair(
  alleleA: string,
  alleleB: string,
  hierarchy: string[],
): [string, string] {
  const rank = (allele: string) => {
    const index = hierarchy.indexOf(allele);
    return index === -1 ? hierarchy.length : index;
  };

  return rank(alleleA) <= rank(alleleB) ? [alleleA, alleleB] : [alleleB, alleleA];
}

export function parseDiploidGenotype(genotype: string): [string, string] {
  if (genotype.length !== 2) {
    throw new Error(`Expected two-character genotype, got "${genotype}"`);
  }
  return [genotype[0], genotype[1]];
}

export function genotypeLabel(
  alleles: [string, string],
  hierarchy: string[],
): string {
  const [first, second] = sortAllelePair(alleles[0], alleles[1], hierarchy);
  return first === second ? `${first}${second}` : `${first}${second}`;
}

function resolvePhenotype(
  alleles: [string, string],
  preset: LearnLocusPreset,
): string {
  const [first, second] = sortAllelePair(
    alleles[0],
    alleles[1],
    preset.dominanceHierarchy,
  );

  if (first === preset.recessiveAllele && second === preset.recessiveAllele) {
    return preset.phenotypeRecessive;
  }

  return preset.phenotypeDominant;
}

function uniqueGametes(alleles: [string, string]): string[] {
  return alleles[0] === alleles[1] ? [alleles[0]] : [alleles[0], alleles[1]];
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function gcdList(values: number[]): number {
  return values.reduce((current, value) => gcd(current, value));
}

function formatRatio(counts: { label: string; count: number }[]): string {
  const filtered = counts.filter((entry) => entry.count > 0);
  if (filtered.length === 0) return '—';

  const divisor = gcdList(filtered.map((entry) => entry.count));
  return filtered.map((entry) => entry.count / divisor).join(' : ');
}

export function buildPunnettSquare(
  parent1: [string, string],
  parent2: [string, string],
  preset: LearnLocusPreset,
): PunnettSquareResult {
  const rowGametes = uniqueGametes(parent1);
  const colGametes = uniqueGametes(parent2);
  const cellProbability = 1 / (rowGametes.length * colGametes.length);

  const cells: PunnettCell[][] = rowGametes.map((rowGamete) =>
    colGametes.map((colGamete) => {
      const alleles = sortAllelePair(rowGamete, colGamete, preset.dominanceHierarchy);
      return {
        alleles,
        label: genotypeLabel(alleles, preset.dominanceHierarchy),
        probability: cellProbability,
        phenotype: resolvePhenotype(alleles, preset),
      };
    }),
  );

  const genotypeMap = new Map<string, PunnettOutcome>();
  const phenotypeMap = new Map<string, PunnettOutcome>();

  for (const row of cells) {
    for (const cell of row) {
      const genotypeEntry = genotypeMap.get(cell.label);
      if (genotypeEntry) {
        genotypeEntry.probability += cell.probability;
      } else {
        genotypeMap.set(cell.label, {
          label: cell.label,
          phenotype: cell.phenotype,
          probability: cell.probability,
        });
      }

      const phenotypeEntry = phenotypeMap.get(cell.phenotype);
      if (phenotypeEntry) {
        phenotypeEntry.probability += cell.probability;
      } else {
        phenotypeMap.set(cell.phenotype, {
          label: cell.phenotype,
          phenotype: cell.phenotype,
          probability: cell.probability,
        });
      }
    }
  }

  const totalCells = rowGametes.length * colGametes.length;
  const outcomes = [...genotypeMap.values()].sort((a, b) => b.probability - a.probability);
  const phenotypeOutcomes = [...phenotypeMap.values()].sort(
    (a, b) => b.probability - a.probability,
  );

  const ratioLabel = formatRatio(
    outcomes.map((outcome) => ({
      label: outcome.label,
      count: Math.round(outcome.probability * totalCells),
    })),
  );

  return {
    rowGametes,
    colGametes,
    cells,
    outcomes,
    phenotypeOutcomes,
    ratioLabel,
  };
}

export function gameteDescription(
  alleles: [string, string],
  preset: LearnLocusPreset,
): string {
  if (alleles[0] === alleles[1]) {
    return `Always passes ${alleles[0]}`;
  }

  return `50% ${preset.dominantAllele} · 50% ${preset.recessiveAllele}`;
}

export function zygosityLabel(genotype: string, preset: LearnLocusPreset): string {
  const [first, second] = parseDiploidGenotype(genotype);
  if (first === second) {
    return first === preset.recessiveAllele ? 'homozygous recessive' : 'homozygous dominant';
  }
  return 'heterozygous';
}
