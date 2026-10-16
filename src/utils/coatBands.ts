/**
 * Derives what a single hair looks like, root to tip, from a genotype.
 * Pure data, no DOM: used by the fur tile renderer and the banded hair bar.
 */
type GenotypeMap = Record<string, [string, string]>;

export interface HairBand {
  color: string;
  /** Share of the hair length, 0..1; a hair's bands sum to 1 */
  frac: number;
  label: string;
}

export type CoatPattern = 'self' | 'agouti' | 'broken' | 'charlie' | 'pointed' | 'white';

export interface CoatSpec {
  /** Bands of the main body hair (for broken/charlie: the coloured patches) */
  bands: HairBand[];
  /** Bands of the white areas (broken, charlie) or the dark points (pointed) */
  secondary: HairBand[] | null;
  pattern: CoatPattern;
  /** Dark guard-hair colour shown over agouti coats */
  guard: string | null;
  /** 0..1 share of white silvered hairs (sisi) */
  silver: number;
  sheen: number;
  /** Plain description for alt / aria text */
  description: string;
  /** Stable cache key: two genotypes that look identical share a key */
  key: string;
}

const ORDER: Record<string, string[]> = {
  A: ['A', 'at', 'a'],
  B: ['B', 'b'],
  C: ['C', 'cchd', 'cchl', 'ch', 'c'],
  D: ['D', 'd'],
  E: ['Ed', 'Es', 'E', 'ej', 'e'],
  En: ['En', 'en'],
  V: ['V', 'v'],
  Si: ['Si', 'si'],
};

function top(g: GenotypeMap, locus: string, fallback: string): string {
  const pair = g[locus];
  if (!pair) return fallback;
  const o = ORDER[locus];
  return [...pair].sort((x, y) => o.indexOf(x) - o.indexOf(y))[0];
}
const homo = (g: GenotypeMap, l: string, a: string) => !!g[l] && g[l][0] === a && g[l][1] === a;

const WHITE: HairBand[] = [
  { color: '#efece4', frac: 0.5, label: 'white base' },
  { color: '#fbfaf6', frac: 0.5, label: 'white' },
];

interface Pigments {
  eu: string; // black-type pigment at full strength
  euName: string;
  under: string; // slate undercolour
  underName: string;
  phaeo: string; // yellow/orange pigment
  phaeoName: string;
}

function pigments(b: string, d: string, c: string): Pigments {
  const dil = d === 'd';
  const brown = b === 'b';
  let p: Pigments = brown
    ? dil
      ? { eu: '#a9969f', euName: 'lilac', under: '#c9bcc0', underName: 'pale lilac base', phaeo: '#e6c08e', phaeoName: 'fawn' }
      : { eu: '#3d2418', euName: 'chocolate', under: '#8a6a58', underName: 'dove base', phaeo: '#d08a45', phaeoName: 'orange' }
    : dil
      ? { eu: '#6e7790', euName: 'blue-grey', under: '#8b93a6', underName: 'pale blue base', phaeo: '#e6c08e', phaeoName: 'fawn' }
      : { eu: '#0b0b0e', euName: 'black', under: '#56607a', underName: 'slate base', phaeo: '#d08a45', phaeoName: 'orange' };
  if (c === 'cchd') p = { ...p, phaeo: '#f1eee6', phaeoName: 'pearl white' };
  if (c === 'cchl') {
    p = { ...p, phaeo: '#e9dfcf', phaeoName: 'pale cream', eu: brown ? '#5a4030' : '#2e241f', euName: 'sepia' };
  }
  return p;
}

export function deriveCoat(g: GenotypeMap): CoatSpec {
  const A = top(g, 'A', 'a');
  const B = top(g, 'B', 'B');
  const C = top(g, 'C', 'C');
  const D = top(g, 'D', 'D');
  const E = top(g, 'E', 'E');
  const En = g.En ? (homo(g, 'En', 'En') ? 'EnEn' : homo(g, 'En', 'en') ? 'enen' : 'Enen') : 'enen';
  const silver = homo(g, 'Si', 'si') ? 0.75 : 0;
  const finish = (s: Omit<CoatSpec, 'key' | 'description'>, desc: string): CoatSpec => {
    const bandText = s.bands.map((b) => b.label).join(', ');
    let description = `${desc}. Each hair, root to tip: ${bandText}`;
    if (s.pattern === 'broken') description += '. White coat with coloured patches';
    if (s.pattern === 'charlie') description += '. Mostly white with small coloured marks';
    if (s.pattern === 'pointed') description += '. White body with dark nose, ears, feet and tail';
    if (s.silver) description += '. Scattered white silvered hairs';
    const key = JSON.stringify([s.pattern, s.bands, s.secondary, s.guard, s.silver]);
    return { ...s, description, key };
  };

  if (C === 'c') {
    return finish({ bands: WHITE, secondary: null, pattern: 'white', guard: null, silver: 0, sheen: 0.08 }, 'Ruby-eyed white fur, no pigment');
  }
  if (homo(g, 'V', 'v')) {
    return finish({ bands: WHITE, secondary: null, pattern: 'white', guard: null, silver: 0, sheen: 0.08 }, 'Blue-eyed white fur');
  }

  const p = pigments(B, D, C);
  let bands: HairBand[];
  let guard: string | null = null;
  let desc: string;

  if (C === 'ch') {
    const points: HairBand[] = [
      { color: p.under, frac: 0.4, label: p.underName },
      { color: p.eu, frac: 0.6, label: p.euName },
    ];
    return finish(
      { bands: [{ color: '#f2f0ea', frac: 1, label: 'white' }], secondary: points, pattern: 'pointed', guard: null, silver: 0, sheen: 0.08 },
      `Himalayan fur, white with ${p.euName} points`,
    );
  }

  if (E === 'e' || E === 'ej') {
    // No black pigment in the body coat: red / fawn / tort
    if (A === 'A') {
      bands = [
        { color: C === 'cchd' ? '#f6f3ec' : '#f0d9b5', frac: 0.45, label: 'cream base' },
        { color: p.phaeo, frac: 0.55, label: p.phaeoName === 'pearl white' ? 'white' : p.phaeoName },
      ];
      desc = `${p.phaeoName === 'pearl white' ? 'Pale' : p.phaeoName === 'fawn' ? 'Fawn' : 'Orange'} fur`;
    } else {
      bands = [
        { color: '#e8c9a0', frac: 0.45, label: 'cream base' },
        { color: p.phaeo, frac: 0.4, label: p.phaeoName },
        { color: p.under, frac: 0.15, label: `${p.euName} smoke tip` },
      ];
      desc = `Tortoiseshell fur, ${p.phaeoName} shaded ${p.euName}`;
    }
  } else if (E === 'Ed' || A === 'a') {
    bands = [
      { color: p.under, frac: 0.5, label: p.underName },
      { color: p.eu, frac: 0.5, label: p.euName },
    ];
    desc = `Self ${p.euName} fur`;
  } else if (A === 'at') {
    bands = [
      { color: p.under, frac: 0.5, label: p.underName },
      { color: p.eu, frac: 0.5, label: p.euName },
    ];
    desc = `${p.euName[0].toUpperCase()}${p.euName.slice(1)} fur with ${p.phaeoName === 'pearl white' ? 'white' : 'tan'} belly and eye rings (tan pattern)`;
  } else if (E === 'Es') {
    bands = [
      { color: p.under, frac: 0.5, label: p.underName },
      { color: p.phaeo, frac: 0.12, label: `thin ${p.phaeoName} band` },
      { color: p.eu, frac: 0.38, label: `${p.euName} tip` },
    ];
    guard = p.eu;
    desc = `Steel fur, ${p.euName} with a faint ticked band`;
  } else {
    bands = [
      { color: p.under, frac: 0.5, label: p.underName },
      { color: p.phaeo, frac: 0.38, label: `${p.phaeoName} band` },
      { color: p.eu, frac: 0.12, label: `${p.euName} tip` },
    ];
    guard = p.eu;
    desc = `Agouti fur, ${p.phaeoName} ticked with ${p.euName}`;
  }

  const pattern: CoatPattern = En === 'Enen' ? 'broken' : En === 'EnEn' ? 'charlie' : A === 'A' && E !== 'Ed' && E !== 'e' && E !== 'ej' ? 'agouti' : 'self';
  return finish(
    {
      bands,
      secondary: pattern === 'broken' || pattern === 'charlie' ? WHITE : null,
      pattern,
      guard,
      silver,
      sheen: pattern === 'agouti' ? 0.1 : 0.18,
    },
    desc,
  );
}
