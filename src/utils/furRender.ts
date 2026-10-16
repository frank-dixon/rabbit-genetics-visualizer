/**
 * Procedural fur tile: layered tapered hairs, each banded root to tip by the
 * genotype's HairBands, on a soft flow field. Baked once per (coat, size) to a
 * data URL and cached in memory, so lists of kits cost nothing to redraw.
 */
import type { CoatSpec, HairBand } from './coatBands';

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
export function hashSeed(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}
function valueNoise(seed: number) {
  const R = rng(seed);
  const G = Array.from({ length: 4096 }, () => R());
  const h = (x: number, y: number) => G[(Math.imul(x, 73856093) ^ Math.imul(y, 19349663)) & 4095];
  return (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    let xf = x - xi, yf = y - yi;
    xf = xf * xf * (3 - 2 * xf);
    yf = yf * yf * (3 - 2 * yf);
    const a = h(xi, yi), b = h(xi + 1, yi), c = h(xi, yi + 1), d = h(xi + 1, yi + 1);
    return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
  };
}
type Noise = ReturnType<typeof valueNoise>;
const fbm = (n: Noise, x: number, y: number) => 0.55 * n(x, y) + 0.3 * n(x * 2.1, y * 2.1) + 0.15 * n(x * 4.3, y * 4.3);
function shade(hex: string, f: number) {
  const p = [1, 3, 5].map((i) => parseInt(hex.substr(i, 2), 16));
  return `rgb(${p.map((v) => Math.min(255, Math.round(v * f))).join(',')})`;
}
function bandAt(b: HairBand[], t: number) {
  let a = 0;
  for (const band of b) {
    a += band.frac;
    if (t <= a + 1e-6) return band.color;
  }
  return b[b.length - 1].color;
}

function regionBands(c: CoatSpec, x: number, y: number, w: number, h: number, n: Noise, f = Math.max(w, h)): HairBand[] {
  if ((c.pattern === 'broken' || c.pattern === 'charlie') && c.secondary) {
    const v = fbm(n, (x / f) * 3.2, (y / f) * 3.2);
    return v > (c.pattern === 'broken' ? 0.52 : 0.66) ? c.bands : c.secondary;
  }
  if (c.pattern === 'pointed' && c.secondary) {
    const d = Math.hypot(x / w - 1, y / h - 1) + (fbm(n, (x / w) * 5, (y / h) * 5) - 0.5) * 0.25;
    return d < 0.42 ? c.secondary : c.bands;
  }
  return c.bands;
}

export interface FurOpts {
  /** Hair scale in device pixels. Defaults to tile-relative (small tiles). */
  hairPx?: number;
}

/**
 * Draw the fur into a canvas. Hair scale is independent of tile size when
 * hairPx is given, so a big hero tile gets more, finer hairs instead of an
 * enlarged small tile. Each hair is one smooth tapered stroke per colour band
 * with a single brightness, so there are no dashed segment seams.
 */
export function drawFur(cv: HTMLCanvasElement | OffscreenCanvas, c: CoatSpec, seed: number, opts: FurOpts = {}) {
  const w = cv.width, h = cv.height;
  const x = cv.getContext('2d') as CanvasRenderingContext2D | null;
  if (!x) return;
  const R = rng(seed), n = valueNoise(seed);
  const S = opts.hairPx ?? Math.max(w, h) / 220;
  // Pattern field is sampled in a fixed-aspect space so patches keep their shape at any width.
  const F = Math.max(w, h);
  x.fillStyle = shade(regionBands(c, w / 2, h / 2, w, h, n)[0].color, 0.7);
  x.fillRect(0, 0, w, h);
  const N = Math.round((w * h) / (2.2 * S * S));
  x.lineCap = 'round';
  x.lineJoin = 'round';
  const SEG = 8;
  const pts: [number, number][] = Array.from({ length: SEG + 1 }, () => [0, 0]);
  // Strokes are batched per (colour, width) into one path per layer: tens of
  // thousands of hairs then cost a few dozen stroke() calls instead of one each.
  const flush = (batch: Map<string, Path2D>) => {
    for (const [key, path] of batch) {
      const [col, lw] = key.split('|');
      x.strokeStyle = col;
      x.lineWidth = +lw;
      x.stroke(path);
    }
    batch.clear();
  };
  const batch = new Map<string, Path2D>();
  const pathFor = (col: string, lw: number) => {
    const key = `${col}|${lw}`;
    let p = batch.get(key);
    if (!p) batch.set(key, (p = new Path2D()));
    return p;
  };
  const q = (v: number, step: number) => Math.round(v / step) * step;
  const wStep = Math.max(0.15, S * 0.18);
  for (const [lf, bright, vis] of [[0.7, 0.55, 2], [0.85, 0.9, 3], [0.95, 1.0, 4]]) {
    for (let i = 0; i < N / 3; i++) {
      const px = R() * w * 1.1 - w * 0.05, py = R() * h * 1.15 - h * 0.05;
      let a = -1.95 + (fbm(n, (px / F) * 1.5 + 9, (py / F) * 1.5) - 0.5) * 1.1;
      const L = (18 + R() * 10) * S * lf;
      const bands = regionBands(c, px, py, w, h, n);
      const hb = bright * q(0.84 + R() * 0.26, 0.04);
      let cx = px, cy = py;
      for (let k = 0; k <= SEG; k++) {
        pts[k][0] = cx;
        pts[k][1] = cy;
        a += (R() - 0.5) * 0.12 + 0.035;
        cx += (Math.cos(a) * L) / SEG;
        cy += (Math.sin(a) * L) / SEG;
      }
      // Visible part of a lying hair: top layers show only band and tip, deeper layers show more undercolour.
      let k = vis;
      while (k < SEG) {
        const col = bandAt(bands, (k + 0.5) / SEG);
        let e = k + 1;
        while (e < SEG && bandAt(bands, (e + 0.5) / SEG) === col && e - k < 3) e++;
        const t = (k + e) / 2 / SEG;
        const p = pathFor(shade(col, hb), q(S * 1.1 * (1 - t * 0.7), wStep));
        p.moveTo(pts[k][0], pts[k][1]);
        for (let j = k + 1; j < e; j++) p.quadraticCurveTo(pts[j][0], pts[j][1], (pts[j][0] + pts[j + 1][0]) / 2, (pts[j][1] + pts[j + 1][1]) / 2);
        p.lineTo(pts[e][0], pts[e][1]);
        k = e;
      }
      if (c.silver && R() < c.silver * 0.35) {
        const p = pathFor('rgba(255,252,245,.8)', q(S * 0.6, wStep));
        p.moveTo(pts[4][0], pts[4][1]);
        p.quadraticCurveTo(pts[6][0], pts[6][1], pts[SEG][0], pts[SEG][1]);
      }
      // Flush in chunks so later hairs still sit on top of earlier ones.
      if (i % 1500 === 1499) flush(batch);
    }
    flush(batch);
  }
  if (c.guard) {
    x.globalAlpha = 0.85;
    x.strokeStyle = c.guard;
    x.lineWidth = S * 0.8;
    for (let i = 0; i < N / 40; i++) {
      const px = R() * w, py = R() * h * 1.1;
      if (regionBands(c, px, py, w, h, n) !== c.bands) continue;
      const a = -1.95 + (fbm(n, (px / F) * 1.5 + 9, (py / F) * 1.5) - 0.5) * 1.1, L = 30 * S;
      x.beginPath();
      x.moveTo(px, py);
      x.quadraticCurveTo(px + Math.cos(a) * L * 0.5, py + Math.sin(a) * L * 0.5, px + Math.cos(a + 0.08) * L, py + Math.sin(a + 0.08) * L);
      x.stroke();
    }
    x.globalAlpha = 1;
  }
  const g = x.createRadialGradient(w * 0.3, h * 0.25, 0, w * 0.3, h * 0.25, Math.max(w, h) * 0.9);
  g.addColorStop(0, `rgba(255,255,255,${c.sheen})`);
  g.addColorStop(0.6, 'rgba(255,255,255,0)');
  g.addColorStop(1, 'rgba(0,0,0,.18)');
  x.fillStyle = g;
  x.fillRect(0, 0, w, h);
}

const cache = new Map<string, string>();

/** Bake (once) and return a data URL for a coat at a pixel size. Null where canvas is unavailable. */
export function furTileUrl(c: CoatSpec, w: number, h: number, hairPx?: number): string | null {
  const id = `${c.key}|${w}x${h}|${hairPx ?? 'rel'}`;
  const hit = cache.get(id);
  if (hit) return hit;
  if (typeof document === 'undefined') return null;
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  if (!cv.getContext('2d')) return null;
  drawFur(cv, c, hashSeed(c.key), { hairPx });
  let url: string;
  try {
    url = cv.toDataURL('image/webp', 0.94);
    if (!url.startsWith('data:image/webp')) url = cv.toDataURL('image/png');
  } catch {
    return null;
  }
  cache.set(id, url);
  return url;
}

/**
 * Parted close-up: fur combed apart along a straight vertical line, so the
 * undercolour shows in a groove and the hairs either side read root to tip.
 * Hairs are thin, gently curved and lie outward-and-down from the part.
 * Broken/charlie white areas stay white; pointed coats show the body colour.
 */
export function drawParted(cv: HTMLCanvasElement, c: CoatSpec, seed: number) {
  const W = cv.width, H = cv.height;
  const x = cv.getContext('2d');
  if (!x) return;
  const R = rng(seed ^ 0x9e3779b9), n = valueNoise(seed);
  const S = W / 220;
  const px0 = W / 2;
  // Zoomed window of the coat: sample the pattern field near a patch edge.
  // Close-up sits on a coloured patch; broken/charlie white creeps in only at the outer edge, and stays white.
  const regionAt = (hx: number, hy: number): HairBand[] => {
    if (!((c.pattern === 'broken' || c.pattern === 'charlie') && c.secondary)) return c.bands;
    const edge = Math.abs(hx - W / 2) / W + (fbm(n, (hx / W) * 2.5, (hy / H) * 2.5) - 0.5) * 0.3;
    return edge > 0.4 ? c.secondary : c.bands;
  };
  const tipOf = (b: HairBand[]) => b[b.length - 1].color;
  const base = regionAt(px0, H / 2);
  x.fillStyle = shade(tipOf(base), 0.82);
  x.fillRect(0, 0, W, H);
  // Undercolour groove
  const gw = W * 0.09;
  const g = x.createLinearGradient(px0 - gw, 0, px0 + gw, 0);
  g.addColorStop(0, shade(base[0].color, 0.92));
  g.addColorStop(0.5, shade(base[0].color, 0.62));
  g.addColorStop(1, shade(base[0].color, 0.92));
  x.fillStyle = g;
  x.fillRect(px0 - gw, 0, gw * 2, H);
  x.lineCap = 'round';
  const hair = (rx: number, ry: number, side: number, L: number, a0: number, from: number, width: number, b: HairBand[], bright: number) => {
    const segs = 10;
    let cx = rx, cy = ry, a = a0;
    for (let k = 0; k < segs; k++) {
      const t = (k + 0.5) / segs;
      a += side * 0.035; // gentle droop away from the part
      const nx = cx + (Math.cos(a) * L) / segs, ny = cy + (Math.sin(a) * L) / segs;
      if (t >= from) {
        x.strokeStyle = shade(bandAt(b, t), bright);
        x.lineWidth = width * (1 - t * 0.7);
        x.beginPath();
        x.moveTo(cx, cy);
        x.lineTo(nx, ny);
        x.stroke();
      }
      cx = nx;
      cy = ny;
    }
  };
  // Lying coat away from the part (tips only)
  for (let i = 0; i < 1400; i++) {
    const side = R() < 0.5 ? -1 : 1;
    const rx = px0 + side * (gw * 1.2 + R() * W * 0.5), ry = R() * H * 1.2 - H * 0.15;
    const a = side > 0 ? 0.95 + R() * 0.25 : Math.PI - 0.95 - R() * 0.25;
    hair(rx, ry, side, W * (0.14 + R() * 0.08), a, 0.55, S * 0.75, regionAt(rx, ry), 0.82 + R() * 0.3);
  }
  // Hairs rooted at the part, full root-to-tip banding
  for (const side of [-1, 1]) {
    for (let i = 0; i < 420; i++) {
      const ry = -H * 0.15 + R() * H * 1.2, rx = px0 + side * (gw * 0.35 + R() * gw * 0.5);
      const a = side > 0 ? 0.5 + R() * 0.25 : Math.PI - 0.5 - R() * 0.25;
      hair(rx, ry, side, W * (0.3 + R() * 0.12), a, 0, S * 0.85, regionAt(rx, ry), 0.86 + R() * 0.26);
    }
  }
  if (c.silver) {
    x.strokeStyle = 'rgba(255,252,245,.75)';
    x.lineWidth = S * 0.5;
    for (let i = 0; i < 160 * c.silver; i++) {
      const side = R() < 0.5 ? -1 : 1, rx = px0 + side * (gw + R() * W * 0.4), ry = R() * H;
      x.beginPath();
      x.moveTo(rx, ry);
      x.lineTo(rx + side * W * 0.08, ry + W * 0.09);
      x.stroke();
    }
  }
  const v = x.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, W * 0.75);
  v.addColorStop(0, 'rgba(0,0,0,0)');
  v.addColorStop(1, 'rgba(0,0,0,.22)');
  x.fillStyle = v;
  x.fillRect(0, 0, W, H);
}

/** Bake (once per coat) the parted close-up. Same cache, separate key. */
export function partedTileUrl(c: CoatSpec, size: number): string | null {
  const id = `${c.key}|parted|${size}`;
  const hit = cache.get(id);
  if (hit) return hit;
  if (typeof document === 'undefined') return null;
  const cv = document.createElement('canvas');
  cv.width = size;
  cv.height = size;
  if (!cv.getContext('2d')) return null;
  drawParted(cv, c, hashSeed(c.key));
  let url: string;
  try {
    url = cv.toDataURL('image/webp', 0.88);
    if (!url.startsWith('data:image/webp')) url = cv.toDataURL('image/png');
  } catch {
    return null;
  }
  cache.set(id, url);
  return url;
}
