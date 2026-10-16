import { describe, expect, it } from 'vitest';
import { fitTileSize } from '../tileSize';

describe('fitTileSize', () => {
  it('renders at CSS size × DPR, never smaller', () => {
    const a = fitTileSize(480, 190, 2);
    expect(a.w).toBeGreaterThanOrEqual(960);
    expect(a.h).toBeGreaterThanOrEqual(380);
    expect(a.w % 8).toBe(0);
  });
  it('keeps the hair scale nearly fixed in CSS px as tiles grow', () => {
    expect(fitTileSize(480, 190, 1).hair).toBe(fitTileSize(900, 300, 1).hair);
    expect(fitTileSize(480, 190, 2).hair).toBeCloseTo(2 * fitTileSize(480, 190, 1).hair, 2);
  });
  it('caps DPR at 3', () => {
    expect(fitTileSize(100, 100, 4).w).toBe(fitTileSize(100, 100, 3).w);
  });
});
