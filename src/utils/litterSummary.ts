import { calculateCross } from './geneticEngine';
import { resolvePlainEnglishPhenotype } from './plainEnglishPhenotype';

type GenotypeMap = Record<string, [string, string]>;

export interface LitterPhenotype {
  phenotype: string;
  title: string;
  plainEnglish: string;
  probability: number;
  genotype: GenotypeMap;
  variantCount: number;
}

/** Group the real engine's outcomes by headline coat (text before the first ';'), most likely first. */
export function summarizeLitter(parent1: GenotypeMap, parent2: GenotypeMap): LitterPhenotype[] {
  const groups = new Map<string, LitterPhenotype>();
  for (const outcome of calculateCross(parent1, parent2)) {
    const title = outcome.phenotype.split(';')[0].trim();
    const existing = groups.get(title);
    if (existing) {
      existing.probability += outcome.probability;
      existing.variantCount += 1;
      continue;
    }
    groups.set(title, {
      phenotype: outcome.phenotype,
      title,
      plainEnglish: resolvePlainEnglishPhenotype(outcome.genotypeByLocus),
      probability: outcome.probability,
      genotype: outcome.genotypeByLocus,
      variantCount: 1,
    });
  }
  return [...groups.values()].sort((a, b) => b.probability - a.probability);
}

/** "3 in 8"-style phrase for a probability, using a small denominator when exact. */
export function oddsPhrase(probability: number): string {
  if (probability >= 1 - 1e-9) return 'Every kit';
  for (const denom of [2, 4, 8, 16, 32, 64]) {
    const num = probability * denom;
    if (Math.abs(num - Math.round(num)) < 1e-9 && Math.round(num) > 0) {
      return `${Math.round(num)} in ${denom}`;
    }
  }
  return `${(probability * 100).toFixed(1)}%`;
}
