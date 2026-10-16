import { describe, expect, it } from 'vitest';
import { buildDefaultGenotypes } from '../../data/rabbitGenetics';
import { deriveCoat } from '../coatBands';

type G = Record<string, [string, string]>;
const base: G = {
  ...buildDefaultGenotypes(),
  A: ['a', 'a'], B: ['B', 'B'], C: ['C', 'C'], D: ['D', 'D'], E: ['E', 'E'],
  En: ['en', 'en'], V: ['V', 'V'], Si: ['Si', 'Si'],
};
const r = (o: G) => deriveCoat({ ...base, ...o });
const labels = (o: G) => r(o).bands.map((b) => b.label);

describe('hair band derivation', () => {
  it('bands always sum to the whole hair', () => {
    for (const A of ['A', 'at', 'a']) for (const C of ['C', 'cchd', 'cchl', 'ch', 'c']) for (const E of ['Ed', 'Es', 'E', 'ej', 'e']) for (const B of ['B', 'b']) for (const D of ['D', 'd']) {
      const c = r({ A: [A, A], B: [B, B], C: [C, C], D: [D, D], E: [E, E] });
      expect(c.bands.reduce((s, b) => s + b.frac, 0)).toBeCloseTo(1, 6);
      c.secondary?.forEach(() => expect(c.secondary!.reduce((s, b) => s + b.frac, 0)).toBeCloseTo(1, 6));
    }
  });
  it('self black: slate base, black', () => expect(labels({})).toEqual(['slate base', 'black']));
  it('chestnut agouti: slate, orange band, black tip; with guard hairs', () => {
    const c = r({ A: ['A', 'a'] });
    expect(c.bands.map((b) => b.label)).toEqual(['slate base', 'orange band', 'black tip']);
    expect(c.pattern).toBe('agouti');
    expect(c.guard).not.toBeNull();
  });
  it('tan (at) keeps a self hair and says tan pattern', () => {
    const c = r({ A: ['at', 'a'] });
    expect(c.bands).toHaveLength(2);
    expect(c.description).toMatch(/tan pattern/);
  });
  it('chocolate, blue and lilac change the pigment', () => {
    expect(labels({ B: ['b', 'b'] })).toContain('chocolate');
    expect(labels({ D: ['d', 'd'] })).toContain('blue-grey');
    expect(labels({ B: ['b', 'b'], D: ['d', 'd'] })).toContain('lilac');
    expect(labels({ B: ['B', 'b'], D: ['D', 'd'] })).toContain('black');
  });
  it('chinchilla turns the orange band pearl white', () => {
    expect(labels({ A: ['A', 'A'], C: ['cchd', 'c'] })).toContain('pearl white band');
  });
  it('Himalayan: white body, dark points', () => {
    const c = r({ C: ['ch', 'c'] });
    expect(c.pattern).toBe('pointed');
    expect(c.bands.map((b) => b.label)).toEqual(['white']);
    expect(c.secondary!.map((b) => b.label)).toContain('black');
  });
  it('REW (cc) and Vienna white (vv) are white and override everything', () => {
    expect(r({ A: ['A', 'A'], C: ['c', 'c'], En: ['En', 'en'] }).pattern).toBe('white');
    expect(r({ V: ['v', 'v'] }).pattern).toBe('white');
    expect(r({ C: ['c', 'c'] }).description).toMatch(/Ruby-eyed/);
  });
  it('E series: steel, dominant black, red, tort', () => {
    expect(labels({ A: ['A', 'A'], E: ['Es', 'E'] })).toContain('thin orange band');
    expect(r({ A: ['A', 'A'], E: ['Ed', 'e'] }).pattern).toBe('self');
    expect(labels({ A: ['A', 'A'], E: ['e', 'e'] })).toEqual(['cream base', 'orange']);
    expect(labels({ E: ['e', 'e'] })).toContain('black smoke tip');
    expect(labels({ A: ['A', 'A'], E: ['E', 'e'] })).toContain('orange band');
  });
  it('silvering only for sisi', () => {
    expect(r({ Si: ['si', 'si'] }).silver).toBeGreaterThan(0);
    expect(r({ Si: ['Si', 'si'] }).silver).toBe(0);
    expect(r({ Si: ['si', 'si'] }).description).toMatch(/silvered/);
  });
  it('broken (Enen) and charlie (EnEn) add white areas', () => {
    expect(r({ En: ['En', 'en'] }).pattern).toBe('broken');
    expect(r({ En: ['En', 'En'] }).pattern).toBe('charlie');
    expect(r({ En: ['En', 'en'] }).secondary![1].label).toBe('white');
  });
  it('same look, same cache key; different look, different key', () => {
    expect(r({ A: ['a', 'a'], B: ['B', 'b'] }).key).toBe(r({ B: ['B', 'B'] }).key);
    expect(r({ En: ['En', 'en'] }).key).not.toBe(r({}).key);
  });
});
