import { describe, expect, it } from 'vitest';
import { buildDefaultGenotypes } from '../../data/rabbitGenetics';
import { bcGametes, calculateCross } from '../geneticEngine';

type G = Record<string, [string, string]>;
const base = buildDefaultGenotypes();
const rabbit = (over: G): G => ({ ...base, ...over });

/** Sum offspring probability by the kit's B and C pairs, e.g. "B/b C/c". */
function bcTotals(outcomes: ReturnType<typeof calculateCross>): Record<string, number> {
  const t: Record<string, number> = {};
  for (const o of outcomes) {
    const k = `${o.genotypeByLocus.B.join('/')} ${o.genotypeByLocus.C.join('/')}`;
    t[k] = (t[k] ?? 0) + o.probability;
  }
  return t;
}

const doe = rabbit({ B: ['B', 'b'], C: ['C', 'c'] });
const buck = rabbit({ B: ['b', 'b'], C: ['c', 'c'] });

describe('B–C gametes', () => {
  it('cis doe BC/bc makes 32/32/18/18', () => {
    const g = bcGametes(doe, 'cis', 0.36);
    expect(g.get('B|C')).toBeCloseTo(0.32);
    expect(g.get('b|c')).toBeCloseTo(0.32);
    expect(g.get('B|c')).toBeCloseTo(0.18);
    expect(g.get('b|C')).toBeCloseTo(0.18);
  });
  it('trans doe Bc/bC flips to 18/18/32/32', () => {
    const g = bcGametes(doe, 'trans', 0.36);
    expect(g.get('B|C')).toBeCloseTo(0.18);
    expect(g.get('B|c')).toBeCloseTo(0.32);
  });
  it('unknown phase is the average of both phases, i.e. 25% each', () => {
    const u = bcGametes(doe, 'unknown');
    const cis = bcGametes(doe, 'cis');
    const trans = bcGametes(doe, 'trans');
    for (const k of ['B|C', 'b|c', 'B|c', 'b|C']) {
      expect(u.get(k)).toBeCloseTo(0.25);
      expect(((cis.get(k) ?? 0) + (trans.get(k) ?? 0)) / 2).toBeCloseTo(0.25);
    }
  });
  it('frequencies sum to 1 and r = 0.5 equals independence', () => {
    const g = bcGametes(doe, 'cis', 0.5);
    expect([...g.values()].reduce((a, b) => a + b, 0)).toBeCloseTo(1);
    for (const v of g.values()) expect(v).toBeCloseTo(0.25);
  });
  it('a parent homozygous at B has phase-proof gametes', () => {
    const g = bcGametes(rabbit({ B: ['B', 'B'], C: ['C', 'c'] }), 'cis');
    expect(g.get('B|C')).toBeCloseTo(0.5);
    expect(g.get('B|c')).toBeCloseTo(0.5);
  });
});

describe('B–C offspring', () => {
  it('BC/bc doe × bc/bc buck gives 32/32/18/18 kits', () => {
    const t = bcTotals(calculateCross(doe, buck, { phase: { parent1: 'cis' } }));
    expect(t['B/b C/c']).toBeCloseTo(0.32);
    expect(t['b/b c/c']).toBeCloseTo(0.32);
    expect(t['B/b c/c']).toBeCloseTo(0.18);
    expect(t['b/b C/c']).toBeCloseTo(0.18);
  });
  it('unknown phase keeps plain Punnett odds (25% each)', () => {
    const t = bcTotals(calculateCross(doe, buck));
    for (const v of Object.values(t)) expect(v).toBeCloseTo(0.25);
  });
  it('five-gene testcross: 4.00% and 2.25% per kit genotype', () => {
    const d = rabbit({ A: ['A', 'a'], B: ['B', 'b'], C: ['C', 'c'], D: ['D', 'd'], E: ['E', 'e'] });
    const s = rabbit({ A: ['a', 'a'], B: ['b', 'b'], C: ['c', 'c'], D: ['d', 'd'], E: ['e', 'e'] });
    const out = calculateCross(d, s, { phase: { parent1: 'cis' } });
    expect(out).toHaveLength(32);
    const probs = out.map((o) => o.probability).sort((a, b) => b - a);
    expect(probs[0]).toBeCloseTo(0.04);
    expect(probs[15]).toBeCloseTo(0.04);
    expect(probs[16]).toBeCloseTo(0.0225);
    expect(probs.reduce((a, b) => a + b, 0)).toBeCloseTo(1);
  });
  it('doe AA Bb CC dd EE × buck Aa bb cc dd ee: 4 genotypes at 25% whatever the phase', () => {
    const d = rabbit({ A: ['A', 'A'], B: ['B', 'b'], C: ['C', 'C'], D: ['d', 'd'], E: ['E', 'E'] });
    const s = rabbit({ A: ['A', 'a'], B: ['b', 'b'], C: ['c', 'c'], D: ['d', 'd'], E: ['e', 'e'] });
    for (const phase of ['cis', 'trans', 'unknown'] as const) {
      const out = calculateCross(d, s, { phase: { parent1: phase } });
      expect(out).toHaveLength(4);
      for (const o of out) expect(o.probability).toBeCloseTo(0.25);
    }
  });
  it('multi-allele C (cchd/ch) works with phase', () => {
    const d = rabbit({ B: ['B', 'b'], C: ['cchd', 'ch'] });
    const out = calculateCross(d, buck, { phase: { parent1: 'trans' } });
    const t = bcTotals(out);
    expect(t['B/b ch/c']).toBeCloseTo(0.32);
    expect(t['B/b cchd/c']).toBeCloseTo(0.18);
  });
});
