/**
 * Off-main-thread fur baking. Large tiles (the hero at 2-3× DPR) take a few
 * hundred ms to draw, so they are drawn in a Worker on an OffscreenCanvas and
 * come back as a transferred ImageBitmap (no image encode/decode). Without Worker/OffscreenCanvas (older Safari,
 * tests) it falls back to drawing on the main thread when the browser is idle.
 * Results are cached by coat + pixel size + hair scale.
 */
import type { CoatSpec } from './coatBands';
import { drawFur, hashSeed } from './furRender';

export type FurImage = ImageBitmap | HTMLCanvasElement;

const done = new Map<string, FurImage>();
const pending = new Map<string, Promise<FurImage | null>>();
let worker: Worker | null | undefined;
let nextId = 1;
const waiters = new Map<number, (r: { bitmap?: ImageBitmap; error?: string; drawMs?: number }) => void>();

function getWorker(): Worker | null {
  if (worker !== undefined) return worker;
  worker = null;
  try {
    if (typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined') {
      const probe = new OffscreenCanvas(1, 1);
      if (probe.getContext('2d') && typeof Path2D !== 'undefined') {
        worker = new Worker(new URL('../workers/fur.worker.ts', import.meta.url), { type: 'module' });
        worker.onmessage = (e) => {
          const cb = waiters.get(e.data.id);
          waiters.delete(e.data.id);
          cb?.(e.data);
        };
        worker.onerror = () => {
          // Worker failed to load: settle everything via the main-thread path.
          worker = null;
          for (const [, cb] of waiters) cb({ error: 'worker failed' });
          waiters.clear();
        };
      }
    }
  } catch {
    worker = null;
  }
  return worker;
}

const idle = (fn: () => void) =>
  typeof requestIdleCallback === 'function' ? requestIdleCallback(fn, { timeout: 300 }) : setTimeout(fn, 0);

export function furKey(c: CoatSpec, w: number, h: number, hair?: number) {
  return `${c.key}|${w}x${h}|${hair ?? 'rel'}`;
}

/** Cached URL if already baked, else null. */
export function furTileCached(c: CoatSpec, w: number, h: number, hair?: number): FurImage | null {
  return done.get(furKey(c, w, h, hair)) ?? null;
}

export function furTileAsync(c: CoatSpec, w: number, h: number, hair?: number): Promise<FurImage | null> {
  const key = furKey(c, w, h, hair);
  const hit = done.get(key);
  if (hit) return Promise.resolve(hit);
  const p = pending.get(key);
  if (p) return p;
  const mainThread = () =>
    new Promise<FurImage | null>((res) =>
      idle(() => {
        if (typeof document === 'undefined') return res(null);
        const cv = document.createElement('canvas');
        cv.width = w;
        cv.height = h;
        if (!cv.getContext('2d')) return res(null);
        drawFur(cv, c, hashSeed(c.key), { hairPx: hair });
        res(cv);
      }),
    );
  const w0 = getWorker();
  const job: Promise<FurImage | null> = w0
    ? new Promise<FurImage | null>((res) => {
        const id = nextId++;
        waiters.set(id, (r) => {
          if (r.bitmap) {
            try {
              performance.measure(`fur-worker ${w}x${h} draw=${r.drawMs?.toFixed(1)}`, { start: 0, duration: 0 });
            } catch {
              /* best-effort timing */
            }
            res(r.bitmap);
          } else mainThread().then(res);
        });
        w0.postMessage({ id, coat: c, seed: hashSeed(c.key), w, h, hair });
      })
    : mainThread();
  const tracked = job.then((url) => {
    pending.delete(key);
    if (url) done.set(key, url);
    return url;
  });
  pending.set(key, tracked);
  return tracked;
}
