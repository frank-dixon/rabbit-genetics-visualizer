import { useEffect, useMemo, useRef, useState } from 'react';
import { deriveCoat } from '../utils/coatBands';
import { furTileAsync, furTileCached, type FurImage } from '../utils/furAsync';
import { fitTileSize } from '../utils/tileSize';

type GenotypeMap = Record<string, [string, string]>;

/**
 * Fur tile rendered at its real on-screen size × devicePixelRatio, so it stays
 * sharp at any width. The box is measured with a ResizeObserver; resizes and
 * DPR changes (zoom, moving to another screen) re-render after a short
 * debounce. Pixel sizes are bucketed so the cache stays small, and each
 * (coat, pixel size) is baked once.
 */
export function CoatTile({
  genotype,
  name,
  className = '',
  decorative = false,
}: {
  genotype: GenotypeMap;
  name?: string;
  /** Legacy size hint, no longer used: tiles always fit their box. */
  size?: string;
  className?: string;
  decorative?: boolean;
}) {
  const coat = useMemo(() => deriveCoat(genotype), [genotype]);
  const box = useRef<HTMLSpanElement>(null);
  const [px, setPx] = useState<{ w: number; h: number; hair: number } | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el || typeof window === 'undefined') return;
    let t: ReturnType<typeof setTimeout> | undefined;
    let first = true;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      const next = fitTileSize(r.width, r.height, window.devicePixelRatio || 1);
      setPx((p) => (p && p.w === next.w && p.h === next.h && p.hair === next.hair ? p : next));
    };
    const schedule = () => {
      clearTimeout(t);
      if (first) {
        first = false;
        measure();
      } else t = setTimeout(measure, 150);
    };
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
    ro?.observe(el);
    schedule();
    let mq: MediaQueryList | null = null;
    const onDpr = () => {
      schedule();
      watchDpr();
    };
    const watchDpr = () => {
      mq?.removeEventListener('change', onDpr);
      mq = window.matchMedia?.(`(resolution: ${window.devicePixelRatio || 1}dppx)`) ?? null;
      mq?.addEventListener('change', onDpr);
    };
    watchDpr();
    return () => {
      clearTimeout(t);
      ro?.disconnect();
      mq?.removeEventListener('change', onDpr);
    };
  }, []);

  // Keep showing this coat's previous image (smoothly scaled) until the sharp one is ready.
  const [shown, setShown] = useState<{ k: string; img: FurImage; w: number; h: number } | null>(null);
  useEffect(() => {
    if (!px) return;
    const hit = furTileCached(coat, px.w, px.h, px.hair);
    if (hit) {
      setShown({ k: coat.key, img: hit, w: px.w, h: px.h });
      return;
    }
    let live = true;
    furTileAsync(coat, px.w, px.h, px.hair).then((u) => live && u && setShown({ k: coat.key, img: u, w: px.w, h: px.h }));
    return () => {
      live = false;
    };
  }, [coat, px]);
  const img = shown && shown.k === coat.key ? shown : null;
  const cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = cv.current;
    if (!el || !img) return;
    el.width = img.w;
    el.height = img.h;
    el.getContext('2d')?.drawImage(img.img, 0, 0);
  }, [img]);
  const alt = decorative ? '' : `${name ? `${name}: ` : ''}${coat.description}`;
  const fallback = coat.bands[coat.bands.length - 1].color;
  return (
    <span ref={box} className={`block overflow-hidden ${className}`} style={{ backgroundColor: fallback }}>
      {img && (
        <canvas
          ref={cv}
          role={decorative ? undefined : 'img'}
          aria-label={decorative ? undefined : alt}
          aria-hidden={decorative || undefined}
          className="block h-full w-full"
        />
      )}
      {!img && !decorative && <span className="sr-only">{alt}</span>}
    </span>
  );
}
