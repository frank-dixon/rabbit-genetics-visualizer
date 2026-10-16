import { LOCI_ORDER, RABBIT_GENETIC_MAP } from '../data/rabbitGenetics';
import { oddsPhrase, type LitterPhenotype } from './litterSummary';

type GenotypeMap = Record<string, [string, string]>;

/** Engine titles read as labels ("Chestnut / agouti"); this makes them read in a sentence. */
export function lookName(title: string): string {
  const spaced = title.replace(/\s*\/\s*/g, '/');
  return spaced.charAt(0).toLowerCase() + spaced.slice(1);
}

/** "3 in 8 kits", "Every kit", or "12.3% of kits", from a real probability. */
export function kitsPhrase(probability: number): string {
  const odds = oddsPhrase(probability);
  if (odds === 'Every kit') return 'every kit';
  if (odds.endsWith('%')) return `${odds} of kits`;
  return `${odds} kits`;
}

/** The hero answer: the litter's most likely look as a short headline. */
export function litterHeadline(groups: LitterPhenotype[]): string {
  if (groups.length === 0) return 'Pick a doe and a buck.';
  if (groups.length === 1) return `Every kit: ${lookName(groups[0].title)}.`;
  if (Math.abs(groups[0].probability - groups[1].probability) < 1e-9) return 'A mixed litter.';
  return `Mostly ${lookName(groups[0].title)}.`;
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/** Plain-English lead paragraph built only from the engine's grouped results. */
export function litterLead(groups: LitterPhenotype[]): string {
  if (groups.length === 0) return '';
  const [top, ...rest] = groups;
  if (rest.length === 0) {
    return `Every kit from this pairing should be ${lookName(top.title)}. The parents can't produce any other look at the genes we model.`;
  }
  const first = `About ${kitsPhrase(top.probability)} from this pairing should be ${lookName(top.title)}.`;
  const others = rest.map((g) => `${lookName(g.title)} (${oddsPhrase(g.probability)})`);
  const then = rest.length === 1 ? `The rest should be ${others[0]}.` : `Expect ${others[0]} next, then ${joinList(others.slice(1))}.`;
  return `${first} ${then} ${groups.length} different looks in all.`;
}

function rank(locusId: string, allele: string): number {
  const order = RABBIT_GENETIC_MAP[locusId]?.dominanceHierarchy ?? [];
  const i = order.indexOf(allele);
  return i === -1 ? order.length : i;
}

/** Order a pair dominant-first so "aA" always reads "Aa". */
export function orderPair(locusId: string, a: string, b: string): [string, string] {
  return rank(locusId, a) <= rank(locusId, b) ? [a, b] : [b, a];
}

export function samePair(locusId: string, x: [string, string], y: [string, string]): boolean {
  const [a, b] = orderPair(locusId, x[0], x[1]);
  const [c, d] = orderPair(locusId, y[0], y[1]);
  return a === c && b === d;
}

/** Loci where at least one parent is heterozygous, i.e. where kits can differ. */
export function varyingLoci(dam: GenotypeMap, sire: GenotypeMap): string[] {
  return LOCI_ORDER.filter((id) => {
    const d = dam[id];
    const s = sire[id];
    return Boolean(d && s) && (d[0] !== d[1] || s[0] !== s[1]);
  });
}

export interface PunnettGrid {
  locusId: string;
  locusName: string;
  damAlleles: [string, string];
  sireAlleles: [string, string];
  /** cells[row][col]: row = dam allele, col = sire allele */
  cells: [string, string][][];
}

export function punnett(locusId: string, dam: GenotypeMap, sire: GenotypeMap): PunnettGrid {
  const d = dam[locusId];
  const s = sire[locusId];
  return {
    locusId,
    locusName: RABBIT_GENETIC_MAP[locusId]?.name ?? locusId,
    damAlleles: d,
    sireAlleles: s,
    cells: d.map((da) => s.map((sa) => orderPair(locusId, da, sa))),
  };
}

/** Plain list of the recessive genes a parent carries hidden (heterozygous loci). */
export function hiddenGenes(genotype: GenotypeMap): string[] {
  const out: string[] = [];
  for (const id of LOCI_ORDER) {
    const pair = genotype[id];
    if (!pair || pair[0] === pair[1]) continue;
    const [, recessive] = orderPair(id, pair[0], pair[1]);
    const allele = RABBIT_GENETIC_MAP[id]?.alleles.find((a) => a.code === recessive);
    if (allele) out.push(`${allele.name.toLowerCase()} (${allele.symbol})`);
  }
  return out;
}
