import { useMemo } from 'react';
import { deriveCoat } from '../utils/coatBands';
import { furTileUrl } from '../utils/furRender';

type GenotypeMap = Record<string, [string, string]>;

/** Size buckets keep the cache small: each coat is baked at most once per bucket. */
const SIZES = { sm: [96, 96], md: [320, 240], lg: [640, 400], sq: [520, 520] } as const;

export function CoatTile({
  genotype,
  name,
  size = 'md',
  className = '',
  decorative = false,
}: {
  genotype: GenotypeMap;
  name?: string;
  size?: keyof typeof SIZES;
  className?: string;
  decorative?: boolean;
}) {
  const coat = useMemo(() => deriveCoat(genotype), [genotype]);
  const [w, h] = SIZES[size];
  const url = useMemo(() => furTileUrl(coat, w, h), [coat, w, h]);
  const alt = decorative ? '' : `${name ? `${name}: ` : ''}${coat.description}`;
  const fallback = coat.bands[coat.bands.length - 1].color;
  return (
    <span className={`block overflow-hidden bg-cover bg-center ${className}`} style={{ backgroundColor: fallback }}>
      {url ? (
        <img src={url} alt={alt} aria-hidden={decorative || undefined} className="block h-full w-full object-cover" draggable={false} />
      ) : (
        !decorative && <span className="sr-only">{alt}</span>
      )}
    </span>
  );
}
