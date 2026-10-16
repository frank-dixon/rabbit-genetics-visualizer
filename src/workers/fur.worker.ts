/// <reference lib="webworker" />
import { drawFur } from '../utils/furRender';
import type { CoatSpec } from '../utils/coatBands';

type Job = { id: number; coat: CoatSpec; seed: number; w: number; h: number; hair?: number };

self.onmessage = async (e: MessageEvent<Job>) => {
  const { id, coat, seed, w, h, hair } = e.data;
  try {
    const t0 = performance.now();
    const cv = new OffscreenCanvas(w, h);
    drawFur(cv, coat, seed, { hairPx: hair });
    const drawMs = performance.now() - t0;
    const bitmap = cv.transferToImageBitmap();
    (self as unknown as Worker).postMessage({ id, bitmap, drawMs }, [bitmap]);
  } catch (err) {
    (self as unknown as Worker).postMessage({ id, error: String(err) });
  }
};
