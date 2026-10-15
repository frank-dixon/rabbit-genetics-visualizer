import type { CSSProperties } from 'react';
import { resolvePhenotypeVisual } from './phenotypeVisual';

type GenotypeMap = Record<string, [string, string]>;

/** CSS custom properties for the .fur-portrait placeholder, derived from the real phenotype visual. */
export function furVars(genotype: GenotypeMap): CSSProperties {
  const v = resolvePhenotypeVisual(genotype);
  const pale = v.pattern === 'white' || v.pattern === 'pointed';
  return {
    '--fur-base': pale ? '#d8d8d0' : v.bodyColor,
    '--fur-hi': pale ? '#fafaf5' : v.bellyColor,
  } as CSSProperties;
}
