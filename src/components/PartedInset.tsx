import { useMemo } from 'react';
import { deriveCoat } from '../utils/coatBands';
import { partedTileUrl } from '../utils/furRender';

type GenotypeMap = Record<string, [string, string]>;

/** Alt text for the parted close-up, root colour to tip colour. */
export function partedAlt(genotype: GenotypeMap): string {
  const c = deriveCoat(genotype);
  const b = c.bands;
  const tidy = (l: string) => l.replace(/ (base|tip|band)$/, '');
  return `Close-up of the fur parted with a comb: ${tidy(b[0].label)} at the root, ${tidy(b[b.length - 1].label)} at the tip`;
}

/** Small rounded close-up overlapping the bottom-right of the hero kit tile. */
export function PartedInset({ genotype }: { genotype: GenotypeMap }) {
  const coat = useMemo(() => deriveCoat(genotype), [genotype]);
  const url = useMemo(() => partedTileUrl(coat, 368), [coat]);
  if (!url) return null;
  return (
    <span className="absolute -bottom-[22px] right-[14px] z-10 block h-[68px] w-[68px] overflow-hidden rounded-[12px] border-[3px] border-paper bg-paper shadow-[0_2px_6px_rgba(19,32,59,.28),0_0_0_1px_rgba(19,32,59,.12)] sm:-bottom-[28px] sm:right-[20px] sm:h-[92px] sm:w-[92px] sm:rounded-[14px]">
      <img src={url} alt={partedAlt(genotype)} className="block h-full w-full" draggable={false} />
    </span>
  );
}
