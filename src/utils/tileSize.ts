/**
 * Device-pixel size and hair scale for a fur tile of a given CSS size.
 * Sizes round up to 8px buckets (cache-friendly, never undersized), DPR is
 * capped at 3. Hair scale grows only gently with tile size, so big tiles get
 * many more fine hairs rather than an enlarged small tile.
 */
export function fitTileSize(cssW: number, cssH: number, dpr: number) {
  const d = Math.min(3, Math.max(1, dpr));
  const up = (v: number) => Math.max(8, Math.ceil((v * d) / 8) * 8);
  const cssMax = Math.max(cssW, cssH);
  const rel = Math.min(1.15, Math.max(0.42, cssMax / 220));
  return { w: up(cssW), h: up(cssH), hair: Math.round(rel * d * 100) / 100 };
}
