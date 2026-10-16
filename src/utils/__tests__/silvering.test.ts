import { describe, expect, it } from 'vitest';
import { buildDefaultGenotypes } from '../../data/rabbitGenetics';
import { resolveParentPhenotype } from '../geneticEngine';
import { summarizeLitter } from '../litterSummary';

type G = Record<string, [string, string]>;
const base: G = {
  ...buildDefaultGenotypes(),
  A: ['a', 'a'], B: ['B', 'B'], C: ['C', 'C'], D: ['D', 'D'], E: ['E', 'E'],
  En: ['en', 'en'], V: ['V', 'V'], Si: ['Si', 'Si'],
};
const r = (over: G): G => ({ ...base, ...over });

describe('silvering is recessive', () => {
  it('Sisi is not silvered and is described as a carrier', () => {
    const p = resolveParentPhenotype(r({ Si: ['Si', 'si'] }));
    expect(p).toMatch(/silvering carrier \(Sisi\)/i);
    expect(p).not.toMatch(/light silver|heavy silver|silvered/i);
  });
  it('sisi is silvered', () => {
    expect(resolveParentPhenotype(r({ Si: ['si', 'si'] }))).toMatch(/silver(ed|ing)/i);
    expect(resolveParentPhenotype(r({ Si: ['si', 'si'] }))).not.toMatch(/carrier/i);
  });
  it('SiSi x sisi: every kit looks non-silvered (one look)', () => {
    const looks = summarizeLitter(base, r({ Si: ['si', 'si'] }));
    expect(looks).toHaveLength(1);
    expect(looks[0].title).not.toMatch(/silver/i);
  });
  it('Sisi x sisi: half silvered, half not', () => {
    const looks = summarizeLitter(r({ Si: ['Si', 'si'] }), r({ Si: ['si', 'si'] }));
    expect(looks.map((l) => l.probability)).toEqual([0.5, 0.5]);
  });
  it('Sisi x Sisi: 3/4 non-silvered, 1/4 silvered', () => {
    const p = r({ Si: ['Si', 'si'] });
    const looks = summarizeLitter(p, p);
    expect(looks).toHaveLength(2);
    expect(looks.find((l) => /silver/i.test(l.title))?.probability).toBeCloseTo(0.25);
  });
});
