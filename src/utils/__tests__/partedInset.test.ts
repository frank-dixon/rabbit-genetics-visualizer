import { describe, it, expect } from 'vitest';
import { partedAlt } from '../../components/PartedInset';
import { partedTileUrl } from '../furRender';
import { deriveCoat } from '../coatBands';

const base: Record<string, [string, string]> = {
  A: ['a', 'a'], B: ['B', 'B'], C: ['C', 'C'], D: ['D', 'D'], E: ['E', 'E'], En: ['en', 'en'], V: ['V', 'V'], Si: ['si', 'si'],
};

describe('parted inset', () => {
  it('alt text names root and tip colours for self black', () => {
    expect(partedAlt(base)).toBe('Close-up of the fur parted with a comb: slate at the root, black at the tip');
  });
  it('alt text for chestnut reads root to tip', () => {
    expect(partedAlt({ ...base, A: ['A', 'a'] })).toMatch(/slate at the root, black at the tip/);
  });
  it('returns null without a DOM rather than throwing', () => {
    expect(partedTileUrl(deriveCoat(base), 64)).toBeNull();
  });
});
