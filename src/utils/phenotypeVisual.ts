import { LOCI_ORDER } from '../data/rabbitGenetics';

type GenotypeMap = Record<string, [string, string]>;

export type EyeVisual = 'ruby' | 'blue' | 'pink' | 'dark';
export type PatternVisual = 'solid' | 'agouti' | 'broken' | 'charlie' | 'pointed' | 'white';

export interface PhenotypeVisual {
  bodyColor: string;
  bellyColor: string;
  pointColor: string | null;
  patchColor: string | null;
  eyeColor: EyeVisual;
  pattern: PatternVisual;
  silvering: number;
  steelTips: boolean;
}

function isHomozygous(pair: [string, string], allele: string): boolean {
  return pair[0] === allele && pair[1] === allele;
}

function isHeterozygous(pair: [string, string], alleleA: string, alleleB: string): boolean {
  return (
    (pair[0] === alleleA && pair[1] === alleleB) || (pair[0] === alleleB && pair[1] === alleleA)
  );
}

function resolvedAllele(locusId: string, pair: [string, string]): string {
  const hierarchy = {
    A: ['A', 'at', 'a'],
    B: ['B', 'b'],
    C: ['C', 'cchd', 'cchl', 'ch', 'c'],
    D: ['D', 'd'],
    E: ['Ed', 'Es', 'E', 'ej', 'e'],
    En: ['En', 'en'],
    V: ['V', 'v'],
    Si: ['Si', 'si'],
  } as Record<string, string[]>;

  const order = hierarchy[locusId] ?? [];
  const ranked = [...pair].sort((a, b) => order.indexOf(a) - order.indexOf(b));
  return ranked[0] ?? pair[0];
}

function resolveBaseCoat(resolved: Record<string, string>, genotypes: GenotypeMap) {
  const a = resolved.A;
  const b = resolved.B;
  const d = resolved.D;
  const e = resolved.E;
  const diluted = d === 'd' && isHomozygous(genotypes.D, 'd');

  if (e === 'e') {
    if (a === 'A') {
      return diluted
        ? { body: '#d4b896', belly: '#efe4d0' }
        : { body: '#c2410c', belly: '#ea580c' };
    }
    return diluted
      ? { body: '#e7d4bc', belly: '#f5ead8' }
      : { body: '#ea580c', belly: '#f97316' };
  }

  if (e === 'Es' && a === 'A') {
    return diluted
      ? { body: '#64748b', belly: '#94a3b8' }
      : { body: '#334155', belly: '#64748b' };
  }

  if (a === 'a') {
    if (b === 'b') {
      return diluted
        ? { body: '#a89bb8', belly: '#c4b8d0' }
        : { body: '#6b4423', belly: '#8b5e3c' };
    }
    return diluted
      ? { body: '#5b6b7a', belly: '#7c8ea0' }
      : { body: '#1e293b', belly: '#334155' };
  }

  if (a === 'at') {
    return diluted
      ? { body: '#5b6b7a', belly: '#d4c4a8' }
      : { body: '#1e293b', belly: '#d6c6a8' };
  }

  if (a === 'A') {
    return diluted
      ? { body: '#7c9eb8', belly: '#d4e4f0' }
      : { body: '#8b5a2b', belly: '#e8c4a0' };
  }

  return { body: '#78716c', belly: '#a8a29e' };
}

export function resolvePhenotypeVisual(genotypes: GenotypeMap): PhenotypeVisual {
  const resolved = Object.fromEntries(
    LOCI_ORDER.filter((id) => genotypes[id]).map((id) => [id, resolvedAllele(id, genotypes[id])]),
  ) as Record<string, string>;

  const whiteCoat = { body: '#f8fafc', belly: '#f1f5f9', point: null as string | null };

  if (genotypes.C && isHomozygous(genotypes.C, 'c')) {
    return {
      bodyColor: whiteCoat.body,
      bellyColor: whiteCoat.belly,
      pointColor: null,
      patchColor: null,
      eyeColor: 'ruby',
      pattern: 'white',
      silvering: 0,
      steelTips: false,
    };
  }

  if (genotypes.V && isHomozygous(genotypes.V, 'v')) {
    return {
      bodyColor: whiteCoat.body,
      bellyColor: whiteCoat.belly,
      pointColor: null,
      patchColor: null,
      eyeColor: 'blue',
      pattern: 'white',
      silvering: 0,
      steelTips: false,
    };
  }

  let coat = resolveBaseCoat(resolved, genotypes);
  let eyeColor: EyeVisual = 'dark';
  let pattern: PatternVisual = resolved.A === 'A' || resolved.A === 'at' ? 'agouti' : 'solid';
  let pointColor: string | null = null;
  let patchColor: string | null = coat.body;
  let silvering = 0;
  const steelTips = resolved.E === 'Es' && resolved.A === 'A';

  if (resolved.C === 'ch') {
    pattern = 'pointed';
    coat = { body: '#f8fafc', belly: '#f1f5f9' };
    pointColor = coat.body === '#f8fafc' ? '#1e293b' : '#0f172a';
    eyeColor = 'pink';
  } else if (resolved.C === 'cchd' || resolved.C === 'cchl') {
    coat = { body: '#c4b8a8', belly: '#e8e0d4' };
    pattern = resolved.A === 'A' ? 'agouti' : 'solid';
  }

  if (genotypes.En && isHomozygous(genotypes.En, 'En')) {
    pattern = 'charlie';
    patchColor = coat.body;
    coat = { body: '#f8fafc', belly: '#f1f5f9' };
  } else if (
    genotypes.En &&
    isHeterozygous(genotypes.En, 'En', 'en')
  ) {
    pattern = 'broken';
    patchColor = coat.body;
    coat = { body: '#f8fafc', belly: '#f1f5f9' };
  }

  if (genotypes.Si && isHomozygous(genotypes.Si, 'si')) {
    silvering = 0.75;
  } else if (
    genotypes.Si &&
    isHeterozygous(genotypes.Si, 'Si', 'si')
  ) {
    silvering = 0.35;
  }

  if (
    (genotypes.V && isHeterozygous(genotypes.V, 'V', 'v')) ||
    eyeColor === 'pink'
  ) {
    // Keep pink for Himalayan; Vv may vary — default dark unless vv handled above
  }

  return {
    bodyColor: coat.body,
    bellyColor: coat.belly,
    pointColor,
    patchColor,
    eyeColor,
    pattern,
    silvering,
    steelTips,
  };
}
