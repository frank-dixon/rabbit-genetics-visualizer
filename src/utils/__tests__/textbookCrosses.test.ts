import { describe, expect, it } from 'vitest';
import { buildDefaultGenotypes } from '../../data/rabbitGenetics';
import { PARENT_PRESETS } from '../../data/meatRabbitBreeds';
import { calculateCross } from '../geneticEngine';
import { summarizeLitter } from '../litterSummary';

type G = Record<string, [string, string]>;
const base: G = {
  ...buildDefaultGenotypes(),
  A: ['a', 'a'], B: ['B', 'B'], C: ['C', 'C'], D: ['D', 'D'], E: ['E', 'E'],
  En: ['en', 'en'], V: ['V', 'V'], Si: ['Si', 'Si'],
};
const r = (over: G): G => ({ ...base, ...over });

/** Total probability of kits matching a predicate on their genotype. */
function share(dam: G, sire: G, pred: (g: G) => boolean): number {
  return calculateCross(dam, sire).filter((o) => pred(o.genotypeByLocus)).reduce((s, o) => s + o.probability, 0);
}
const has = (pair: [string, string], a: string) => pair.includes(a);
const preset = (label: string) => PARENT_PRESETS.find((p) => p.label === label)!.genotype;

describe('textbook single-gene crosses', () => {
  it('Aa x Aa: 3/4 agouti, 1/4 self', () => {
    const p = r({ A: ['A', 'a'] });
    expect(share(p, p, (g) => has(g.A, 'A'))).toBeCloseTo(0.75);
    const looks = summarizeLitter(p, p);
    expect(looks).toHaveLength(2);
    expect(looks[0].probability).toBeCloseTo(0.75);
  });
  it('Ee x ee: 1/2 extended, 1/2 non-extension', () => {
    const looks = summarizeLitter(r({ E: ['E', 'e'] }), r({ E: ['e', 'e'] }));
    expect(looks.map((l) => l.probability)).toEqual([0.5, 0.5]);
  });
  it('Enen x enen: half the litter is broken, and that shows as its own look', () => {
    const looks = summarizeLitter(r({ En: ['En', 'en'] }), base);
    expect(looks).toHaveLength(2);
    expect(looks.find((l) => /broken/i.test(l.title))?.probability).toBeCloseTo(0.5);
  });
  it('Enen x Enen: 1/4 charlie, 1/2 broken, 1/4 solid', () => {
    const p = r({ En: ['En', 'en'] });
    const looks = summarizeLitter(p, p);
    expect(looks.find((l) => /charlie/i.test(l.title))?.probability).toBeCloseTo(0.25);
    expect(looks.find((l) => /broken/i.test(l.title))?.probability).toBeCloseTo(0.5);
  });
  it('Bb x Bb carriers: 1/4 chocolate', () => {
    const p = r({ B: ['B', 'b'] });
    expect(summarizeLitter(p, p).find((l) => /chocolate/i.test(l.title))?.probability).toBeCloseTo(0.25);
  });
  it('Cc x Cc carriers: 1/4 ruby-eyed white', () => {
    const p = r({ C: ['C', 'c'] });
    expect(summarizeLitter(p, p).find((l) => /ruby-eyed white/i.test(l.title))?.probability).toBeCloseTo(0.25);
  });
  it('Vv carriers do not split into a separate look', () => {
    expect(summarizeLitter(r({ V: ['V', 'v'] }), base)).toHaveLength(1);
  });
  it('Himalayan kits keep their point colour apart (black vs chocolate points)', () => {
    const looks = summarizeLitter(r({ C: ['ch', 'ch'], B: ['B', 'b'] }), r({ C: ['ch', 'ch'], B: ['B', 'b'] }));
    expect(looks).toHaveLength(2);
  });
});

describe("Frank's reported cross", () => {
  it("Crème d'Argent doe x Broken NZ (Black) buck: half broken, not 100% one look", () => {
    const looks = summarizeLitter(preset("Crème d'Argent"), preset('Broken NZ (Black)'));
    expect(looks).toHaveLength(2);
    expect(looks.map((l) => l.probability)).toEqual([0.5, 0.5]);
  });
});
