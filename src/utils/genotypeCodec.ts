import { LOCI_ORDER } from '../data/rabbitGenetics';

type GenotypeMap = Record<string, [string, string]>;

export interface CrossSnapshot {
  parent1: GenotypeMap;
  parent2: GenotypeMap;
  parent1PresetId: string | null;
  parent2PresetId: string | null;
}

/** Compact wire format: A-aa.B-BB.C-c_c (locus-allele or locus-a_b for heterozygotes) */
export function encodeGenotype(genotype: GenotypeMap): string {
  return LOCI_ORDER.filter((locusId) => genotype[locusId])
    .map((locusId) => {
      const [a, b] = genotype[locusId];
      return a === b ? `${locusId}-${a}${a}` : `${locusId}-${a}_${b}`;
    })
    .join('.');
}

export function decodeGenotype(encoded: string): GenotypeMap | null {
  if (!encoded) return null;

  const genotype: GenotypeMap = {};

  for (const segment of encoded.split('.')) {
    const dashIndex = segment.indexOf('-');
    if (dashIndex <= 0) return null;

    const locusId = segment.slice(0, dashIndex);
    const alleles = segment.slice(dashIndex + 1);

    if (!LOCI_ORDER.includes(locusId as (typeof LOCI_ORDER)[number])) return null;

    if (alleles.includes('_')) {
      const [a, b] = alleles.split('_');
      if (!a || !b) return null;
      genotype[locusId] = [a, b];
    } else if (alleles.length >= 2 && alleles.length % 2 === 0) {
      const half = alleles.length / 2;
      const a = alleles.slice(0, half);
      const b = alleles.slice(half);
      if (a !== b) return null;
      genotype[locusId] = [a, b];
    } else {
      return null;
    }
  }

  return Object.keys(genotype).length > 0 ? genotype : null;
}

export function buildCrossShareUrl(snapshot: CrossSnapshot): string {
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = '';

  url.searchParams.set('p1', encodeGenotype(snapshot.parent1));
  url.searchParams.set('p2', encodeGenotype(snapshot.parent2));

  if (snapshot.parent1PresetId) {
    url.searchParams.set('preset1', snapshot.parent1PresetId);
  }
  if (snapshot.parent2PresetId) {
    url.searchParams.set('preset2', snapshot.parent2PresetId);
  }

  return url.toString();
}

export function parseCrossFromSearch(search: string): CrossSnapshot | null {
  const params = new URLSearchParams(search);
  const p1 = params.get('p1');
  const p2 = params.get('p2');

  if (!p1 || !p2) return null;

  const parent1 = decodeGenotype(p1);
  const parent2 = decodeGenotype(p2);

  if (!parent1 || !parent2) return null;

  const mapLegacyPreset = (presetId: string | null) => {
    if (presetId === 'nz-white') return 'nz-white-field';
    return presetId;
  };

  return {
    parent1,
    parent2,
    parent1PresetId: mapLegacyPreset(params.get('preset1')),
    parent2PresetId: mapLegacyPreset(params.get('preset2')),
  };
}
