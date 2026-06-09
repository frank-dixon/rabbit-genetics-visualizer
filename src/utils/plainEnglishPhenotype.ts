import { LOCI_ORDER, RABBIT_GENETIC_MAP } from '../data/rabbitGenetics';

type GenotypeMap = Record<string, [string, string]>;

function isHomozygous(pair: [string, string], allele: string): boolean {
  return pair[0] === allele && pair[1] === allele;
}

function isHeterozygous(pair: [string, string], a: string, b: string): boolean {
  return (pair[0] === a && pair[1] === b) || (pair[0] === b && pair[1] === a);
}

function resolvedAllele(locusId: string, pair: [string, string]): string {
  const hierarchy = RABBIT_GENETIC_MAP[locusId]?.dominanceHierarchy ?? [];
  const ranked = [...pair].sort(
    (a, b) => hierarchy.indexOf(a) - hierarchy.indexOf(b),
  );
  return ranked[0] ?? pair[0];
}

function baseColorPlain(
  resolved: Record<string, string>,
  genotypes: GenotypeMap,
): string {
  const a = resolved.A;
  const b = resolved.B;
  const d = resolved.D;
  const e = resolved.E;
  const diluted = d === 'd' && genotypes.D && isHomozygous(genotypes.D, 'd');

  if (e === 'e') {
    if (a === 'A') return diluted ? 'light frosted red or fawn' : 'red, fawn, or orange';
    if (a === 'at') return 'otter pattern in chocolate tones';
    return diluted ? 'cream or pearl self color' : 'cream or fawn self color';
  }

  if (e === 'Es' && a === 'A') {
    return 'agouti with silver- or gold-tipped guard hairs';
  }

  if (a === 'a') {
    if (b === 'b') return diluted ? 'solid lilac-gray' : 'solid chocolate-brown';
    return diluted ? 'solid blue-gray' : 'solid black';
  }

  if (a === 'at') {
    return diluted ? 'otter pattern in blue-gray tones' : 'otter pattern with dark top and light belly';
  }

  if (a === 'A') {
    return diluted ? 'blue-toned agouti (opal)' : 'wild-type agouti (chestnut banding)';
  }

  return 'mixed color pattern';
}

export function resolvePlainEnglishPhenotype(genotypes: GenotypeMap): string {
  const resolved = Object.fromEntries(
    LOCI_ORDER.filter((id) => genotypes[id]).map((id) => [
      id,
      resolvedAllele(id, genotypes[id]),
    ]),
  ) as Record<string, string>;

  if (genotypes.C && isHomozygous(genotypes.C, 'c')) {
    return 'Solid white coat with ruby-red eyes (albino).';
  }

  if (genotypes.V && isHomozygous(genotypes.V, 'v')) {
    return 'Solid white coat with blue eyes (Vienna).';
  }

  const parts: string[] = [];

  if (resolved.C === 'ch') {
    if (
      (genotypes.C[0] === 'c' || genotypes.C[1] === 'c') &&
      !isHomozygous(genotypes.C, 'c')
    ) {
      parts.push('pointed white with pale dark markings on nose, ears, feet, and tail');
    } else {
      parts.push('pointed white with dark markings on nose, ears, feet, and tail');
    }
  } else if (resolved.C === 'cchd') {
    parts.push('chinchilla pattern with pearl banding');
  } else if (resolved.C === 'cchl') {
    parts.push('shaded coat — lighter body, darker points');
  }

  const base = baseColorPlain(resolved, genotypes);

  if (genotypes.Si && isHomozygous(genotypes.Si, 'si')) {
    parts.push(`${base}, with heavy silver ticking as the coat matures`);
  } else if (genotypes.Si && isHeterozygous(genotypes.Si, 'Si', 'si')) {
    parts.push(`${base}, with light silver ticking visible`);
  } else {
    parts.push(base);
  }

  if (genotypes.En && isHomozygous(genotypes.En, 'En')) {
    parts.push('mostly white Charlie spotting');
  } else if (genotypes.En && isHeterozygous(genotypes.En, 'En', 'en')) {
    parts.push('broken pattern — colored patches on white');
  }

  if (genotypes.V && isHeterozygous(genotypes.V, 'V', 'v')) {
    parts.push('may carry Vienna (blue-eyed white) genetics');
  }

  const sentence = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  if (parts.length === 1) {
    return `${sentence}.`;
  }

  return `${sentence}; ${parts.slice(1).join('; ')}.`;
}
