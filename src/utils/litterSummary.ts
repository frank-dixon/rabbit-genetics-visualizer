import { calculateCross, type CrossOptions } from './geneticEngine';
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

/**
 * The visible look for a full engine phenotype: every visible part (base coat, pointing,
 * spotting), minus hidden carrier notes and genotype codes in brackets.
 * Earlier this kept only the text before the first ';', which threw away spotting
 * (Enen), and for Himalayan/chinchilla kits threw away the base colour, so different
 * looks were merged into one group and most crosses read as 100% one look.
 */
export function lookTitle(phenotype: string): string {
  return phenotype
    .split(';')
    .map((part) => part.trim())
    .filter((part) => part && !/carrier \(/i.test(part))
    .map((part) => part.replace(/\s*\([^)]*\)/g, '').trim())
    .map((part, i) => (i === 0 ? part : part.charAt(0).toLowerCase() + part.slice(1)))
    .join(', ');
}

/** Group the real engine's outcomes by visible look, most likely first. */
export function summarizeLitter(
  parent1: GenotypeMap,
  parent2: GenotypeMap,
  options: CrossOptions = {},
): LitterPhenotype[] {
  const groups = new Map<string, LitterPhenotype>();
  for (const outcome of calculateCross(parent1, parent2, options)) {
    const title = lookTitle(outcome.phenotype);
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
