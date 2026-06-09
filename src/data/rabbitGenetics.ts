/**
 * Rabbit coat and eye color loci for meat-rabbit breeding visualization.
 *
 * Primary references:
 * - OSU Extension EM 9708 / Parts 1–3 (Cruickshank & Stern, 2022–2025)
 * - OMIA (Online Mendelian Inheritance in Animals) — TYR, TYRP1, ASIP, MLPH, KIT
 * - Fontanesi et al. — MC1R (2006), MLPH dilute (2014), KIT En spotting (2014)
 * - Aigner et al. (2000) — TYR albino mutation in New Zealand White
 * - Dichrome Rabbitry / Pang & Xu — Vienna (V) locus eye color
 */

export interface Allele {
  code: string;
  name: string;
  symbol: string;
  description: string;
  eyeColorEffect?: string;
}

export interface Locus {
  id: string;
  name: string;
  geneSymbol: string;
  /** Rabbit autosome (OCU); null if not anchored in OryCun2.0 reference */
  chromosome: number | null;
  cytogeneticLocation?: string;
  function: string;
  alleles: Allele[];
  /** Most dominant first (OSU Extension convention) */
  dominanceHierarchy: string[];
  notes: string;
  meatRabbitRelevance: string;
  sources: string[];
}

export interface EyeColorRule {
  id: string;
  name: string;
  genotypeSummary: string;
  eyeAppearance: string;
  mechanism: string;
  meatRabbitExample?: string;
  sources: string[];
}

export interface MeatRabbitVariety {
  name: string;
  typicalGenotypeSummary: string;
  coatDescription: string;
  eyeColor: string;
  sources: string[];
}

export const RABBIT_GENETIC_MAP: Record<string, Locus> = {
  A: {
    id: 'A',
    name: 'Agouti (Pattern)',
    geneSymbol: 'ASIP',
    chromosome: 4,
    cytogeneticLocation: 'OCU4',
    function: 'Controls distribution of eumelanin vs pheomelanin across the coat (agouti banding, tan, or solid/self).',
    alleles: [
      {
        code: 'A',
        name: 'Agouti',
        symbol: 'A',
        description:
          'Wild-type banding on each hair shaft; light belly. Produces castor/chestnut/agouti when combined with full color at C.',
      },
      {
        code: 'at',
        name: 'Tan / Otter',
        symbol: 'aᵗ',
        description:
          'Tan or otter pattern — dark top with lighter underside and eye circles. Recessive to A, dominant to a.',
      },
      {
        code: 'a',
        name: 'Self (Non-agouti)',
        symbol: 'a',
        description:
          'Solid/self color with no agouti banding. Required for solid black, blue, chocolate, or lilac selfs.',
      },
    ],
    dominanceHierarchy: ['A', 'at', 'a'],
    notes:
      'Non-agouti (a) is caused by a frameshift in ASIP exon 2 (Fontanesi 2010). Tan (at) is associated with an ~11 kb deletion near the hair-cycle ASIP promoter (Letko et al. 2020).',
    meatRabbitRelevance:
      'New Zealand Red and many colored meat lines are A_. Californian and NZ White are typically self (aa) for uniform body color.',
    sources: [
      'OSU Extension EM 9708',
      'OMIA:000201-9986 (ASIP)',
      'Fontanesi et al. 2010 Genomics',
    ],
  },

  B: {
    id: 'B',
    name: 'Brown / Black Base',
    geneSymbol: 'TYRP1',
    chromosome: 1,
    cytogeneticLocation: 'OCU1',
    function: 'Determines whether eumelanin is black (B_) or brown/chocolate (bb).',
    alleles: [
      {
        code: 'B',
        name: 'Black',
        symbol: 'B',
        description: 'Full black eumelanin pigment. Wild-type allele.',
      },
      {
        code: 'b',
        name: 'Chocolate',
        symbol: 'b',
        description:
          'Brown/chocolate eumelanin only. Homozygous bb prevents black pigment formation (Havana phenotype).',
      },
    ],
    dominanceHierarchy: ['B', 'b'],
    notes:
      'Brown (b) allele: nonsense mutation in TYRP1 exon 2 (p.Trp190*) identified in Havana rabbits (Utzeri & Fontanesi 2014).',
    meatRabbitRelevance:
      'Most commercial white and Californian lines are B_. Chocolate is uncommon in meat herds but appears in specialty color breeding.',
    sources: ['OSU Extension EM 9708', 'OMIA:001249-9986 (TYRP1 brown)'],
  },

  C: {
    id: 'C',
    name: 'Color / Dilution of Phaeomelanin',
    geneSymbol: 'TYR',
    chromosome: 1,
    cytogeneticLocation: 'OCU1q14-q15',
    function:
      'Tyrosinase — controls melanin synthesis and color depth. The c allele eliminates pigment (albino); ch and cchl produce pointed/shaded patterns.',
    alleles: [
      {
        code: 'C',
        name: 'Full Color',
        symbol: 'C',
        description: 'Normal tyrosinase activity; coat color expressed from A, B, D, and E loci.',
        eyeColorEffect: 'Dark brown eyes (with V_ at Vienna locus).',
      },
      {
        code: 'cchd',
        name: 'Chinchilla (Dark)',
        symbol: 'cᶜʰᵈ',
        description:
          'Replaces yellow/red phaeomelanin with pearl/white on banded hairs. Agouti chin chilla, ermine/frost variants with e.',
      },
      {
        code: 'cchl',
        name: 'Shaded / Sable (Light Chinchilla)',
        symbol: 'cᶜʰˡ',
        description:
          'Lightens overall pigment; ears, nose, feet, and tail remain darker. Sable and seal phenotypes.',
      },
      {
        code: 'ch',
        name: 'Himalayan / Pointed White',
        symbol: 'cʰ',
        description:
          'Temperature-sensitive — dark points (nose, ears, feet, tail), white body. Californian and Himalayan breeds.',
        eyeColorEffect: 'Pink to red-tinged eyes (typical of pointed whites).',
      },
      {
        code: 'c',
        name: 'Albino (REW)',
        symbol: 'c',
        description:
          'Complete lack of melanin in coat. Epistatic to all other color loci — masks underlying genotype visually.',
        eyeColorEffect: 'Ruby / red eyes (no iris pigment; blood vessels visible).',
      },
    ],
    dominanceHierarchy: ['C', 'cchd', 'cchl', 'ch', 'c'],
    notes:
      'cchd/cchl/ch show incomplete dominance with each other. cc is epistatic (OSU). NZ White albino: TYR missense c.1118C>A (Aigner et al. 2000). TYR mapped by FISH to OCU1q14-q15.',
    meatRabbitRelevance:
      'New Zealand White and Giant White are cc (ruby-eyed white). Californian is chch or chc (Himalayan pointing). This is the most critical locus for US meat-rabbit market preferences.',
    sources: [
      'OSU Extension EM 9708',
      'OMIA:000202-9986 (TYR albino)',
      'Aigner et al. 2000 Mamm Genome',
    ],
  },

  D: {
    id: 'D',
    name: 'Dilute (Density)',
    geneSymbol: 'MLPH',
    chromosome: null,
    function:
      'Controls melanosome transport/density. Recessive dd dilutes both eumelanin and phaeomelanin.',
    alleles: [
      {
        code: 'D',
        name: 'Dense',
        symbol: 'D',
        description: 'Full-strength pigment expression. Wild-type.',
      },
      {
        code: 'd',
        name: 'Dilute',
        symbol: 'd',
        description:
          'Dilutes black → blue (gray), chocolate → lilac. Also softens agouti and orange tones.',
      },
    ],
    dominanceHierarchy: ['D', 'd'],
    notes:
      'Dilute (d): frameshift in MLPH exon 5 (c.585delG / g.549853delG) — Fontanesi et al. 2014. Gene currently on unplaced scaffold in OryCun2.0 (OMIA).',
    meatRabbitRelevance:
      'Dense (D_) is standard in NZ White, Californian, and NZ Red commercial lines. Blue/lilac dilute appears in Blue Vienna and some show breeds.',
    sources: ['OSU Extension EM 9708', 'OMIA:000031-9986 (MLPH dilute)'],
  },

  E: {
    id: 'E',
    name: 'Extension',
    geneSymbol: 'MC1R',
    chromosome: null,
    function:
      'Melanocortin 1 receptor — controls extension of dark (eumelanin) vs red/yellow (phaeomelanin) pigment.',
    alleles: [
      {
        code: 'Ed',
        name: 'Dominant Black Extension',
        symbol: 'Eᴰ',
        description:
          'Forces full black extension regardless of agouti (except cc albino). Rare in commercial stock.',
      },
      {
        code: 'Es',
        name: 'Steel',
        symbol: 'Eˢ',
        description:
          'Steel tipping on agouti hairs — dark coat with silver or gold guard hairs. Requires A_ genotype.',
      },
      {
        code: 'E',
        name: 'Normal Extension',
        symbol: 'E',
        description: 'Wild-type; allows full expression of A, B, C, and D loci.',
      },
      {
        code: 'ej',
        name: 'Japanese Brindling',
        symbol: 'eʲ',
        description: 'Harlequin/tricolor pattern — alternating color bands across the body.',
      },
      {
        code: 'e',
        name: 'Non-extension (Red / Fawn)',
        symbol: 'e',
        description:
          'Restricts black pigment; produces red, fawn, or orange. Homozygous ee is non-extension.',
      },
    ],
    dominanceHierarchy: ['Ed', 'Es', 'E', 'ej', 'e'],
    notes:
      'NZ White, Californian, Checkered Giant share MC1R c.280_285del6 homozygously (Fontanesi 2006). Red/fawn: c.304_333del30 (e allele). MC1R currently unplaced on OryCun2.0 assembly.',
    meatRabbitRelevance:
      'NZ Red is ee (non-extension). NZ White and Californian carry the same MC1R deletion — black is from aa self, not Ed. Steel (Es) appears in some commercial agouti lines.',
    sources: [
      'OSU Extension EM 9708',
      'Fontanesi et al. 2006 Animal Genetics (MC1R)',
    ],
  },

  En: {
    id: 'En',
    name: 'English Spotting (Broken)',
    geneSymbol: 'KIT',
    chromosome: 15,
    cytogeneticLocation: 'OCU15',
    function:
      'White spotting via KIT proto-oncogene. Heterozygous Enen = broken/spotted; homozygous EnEn = Charlie (mostly white).',
    alleles: [
      {
        code: 'En',
        name: 'English Spotting',
        symbol: 'En',
        description:
          'Dominant spotting allele. En/en produces broken pattern (colored + white patches). En/En produces Charlie (nearly all white, often subvital).',
      },
      {
        code: 'en',
        name: 'Solid (No Spotting)',
        symbol: 'en',
        description: 'Wild-type — no white spotting. Required for solid commercial meat-rabbit appearance.',
      },
    ],
    dominanceHierarchy: ['En', 'en'],
    notes:
      'KIT on OCU15 (Fontanesi et al. 2014 PLOS ONE). Linked to angora and Dutch loci on LG II. En/En associated with megacolon — welfare concern in breeding programs.',
    meatRabbitRelevance:
      'Broken New Zealand and Checkered Giant use Enen. Solid NZ White and Californian are enen.',
    sources: [
      'OSU Extension EM 9708',
      'OMIA:001597-9986 (English spotting)',
      'Fontanesi et al. 2014 PLOS ONE',
    ],
  },

  V: {
    id: 'V',
    name: 'Vienna (Blue-Eyed White)',
    geneSymbol: 'V',
    chromosome: null,
    function:
      'Separate from TYR albino — produces blue-eyed white (BEW) when homozygous vv. Incompletely dominant with variable penetrance in carriers.',
    alleles: [
      {
        code: 'V',
        name: 'Non-Vienna',
        symbol: 'V',
        description: 'Normal pigment pathway. Required for REW (cc) and all standard colored varieties.',
        eyeColorEffect: 'Allows normal dark, ruby, or Himalayan eye colors from other loci.',
      },
      {
        code: 'v',
        name: 'Vienna',
        symbol: 'v',
        description:
          'BEW when homozygous vv. Heterozygous Vv may be Vienna Marked (white Dutch-like patches) or hidden Vienna Carrier.',
        eyeColorEffect: 'Blue eyes when vv. Vv carriers may have blue, brown, or marbled eyes if marked.',
      },
    ],
    dominanceHierarchy: ['V', 'v'],
    notes:
      'Distinct from cc REW — vv rabbits have blue eyes, not ruby. cc masks all coat color; vv overrides coat to white with blue eyes. Vv incomplete penetrance makes vienna difficult to eliminate from a herd.',
    meatRabbitRelevance:
      'Not standard in commercial meat rabbits (NZ White uses cc REW). Vienna Blue is a show/dual-purpose breed. Avoid accidental v introduction when breeding for REW markets.',
    sources: [
      'Dichrome Rabbitry V locus guide',
      'Pang & Xu 2013 / Covrig et al. 2013 (Vienna review)',
      'Breadbox Farm REW vs BEW comparison',
    ],
  },
};

/** Eye color outcomes — coat loci interact; order of evaluation matters for phenotype */
export const EYE_COLOR_RULES: EyeColorRule[] = [
  {
    id: 'bew',
    name: 'Blue eyes (BEW)',
    genotypeSummary: 'vv at V locus (Vienna homozygous)',
    eyeAppearance: 'Clear blue iris',
    mechanism:
      'Vienna allele reduces iris melanin without full tyrosinase knockout. Distinct genetic pathway from TYR albino.',
    meatRabbitExample: 'Blue Vienna breed — not the same as New Zealand White REW.',
    sources: ['Dichrome Rabbitry', 'Pang & Xu 2013'],
  },
  {
    id: 'rew',
    name: 'Ruby / red eyes (REW)',
    genotypeSummary: 'cc at C locus, V_ (non-Vienna)',
    eyeAppearance: 'Bright ruby-red — no iris pigment',
    mechanism:
      'TYR albino eliminates melanin; red appearance from blood vessels behind transparent iris (OCA1). NZ White mutation: c.1118C>A.',
    meatRabbitExample: 'New Zealand White — dominant US meat-rabbit color standard.',
    sources: ['OMIA:000202-9986', 'Aigner et al. 2000', 'OSU Extension Part 3'],
  },
  {
    id: 'himalayan-eyes',
    name: 'Pink / red-tinged eyes (Himalayan)',
    genotypeSummary: 'ch_ at C locus (Himalayan / Californian type)',
    eyeAppearance: 'Pink to dark pink; lighter than REW ruby',
    mechanism:
      'Temperature-sensitive tyrosinase partial activity — reduced eye pigment compared to full color.',
    meatRabbitExample: 'Californian breed standard — white body with dark points.',
    sources: ['OSU Extension Part 3', 'Robinson 1958'],
  },
  {
    id: 'dark',
    name: 'Dark brown eyes (normal)',
    genotypeSummary: 'C_ at C locus and V_ at V locus',
    eyeAppearance: 'Dark brown to black iris',
    mechanism: 'Full tyrosinase and non-Vienna melanin production in iris.',
    meatRabbitExample: 'New Zealand Red, black satins, colored commercial lines.',
    sources: ['OSU Extension EM 9708'],
  },
  {
    id: 'purple-cast',
    name: 'Purple / violet eye cast',
    genotypeSummary: 'vv or Vv combined with bb and/or cchl_/cchlc',
    eyeAppearance: 'Blue-violet or purple tint',
    mechanism:
      'Reduced iris pigment from Vienna combined with additional pigment reduction from chocolate or shaded C alleles.',
    meatRabbitExample: 'Rare in meat herds; seen in specialty BEW/shaded crosses.',
    sources: ['Dichrome Rabbitry'],
  },
];

export const MEAT_RABBIT_VARIETIES: MeatRabbitVariety[] = [
  {
    name: 'New Zealand White',
    typicalGenotypeSummary: 'aa B_ cc D_ E_ enen VV',
    coatDescription: 'Pure white — cc epistatic albino masks all underlying color',
    eyeColor: 'Ruby / red (REW)',
    sources: ['OMIA TYR albino', 'Fontanesi 2006 MC1R', 'OSU Extension'],
  },
  {
    name: 'Californian',
    typicalGenotypeSummary: 'aa B_ chch D_ E_ enen VV',
    coatDescription: 'White body with dark points (nose, ears, feet, tail)',
    eyeColor: 'Pink / red-tinged (Himalayan)',
    sources: ['OSU Extension Part 3', 'Fontanesi 2006 MC1R'],
  },
  {
    name: 'New Zealand Red',
    typicalGenotypeSummary: 'A_ B_ C_ D_ ee enen VV',
    coatDescription: 'Rich red/chestnut from agouti + non-extension (ee)',
    eyeColor: 'Dark brown',
    sources: ['OSU Extension EM 9708', 'Fontanesi 2006 MC1R'],
  },
  {
    name: 'Broken New Zealand',
    typicalGenotypeSummary: 'A_ or aa, B_ C_ D_ E_ Enen VV',
    coatDescription: 'Colored patches on white — heterozygous En spotting',
    eyeColor: 'Dark brown (or ruby if cc)',
    sources: ['OSU Extension EM 9708', 'Fontanesi 2014 KIT'],
  },
  {
    name: 'Blue Vienna',
    typicalGenotypeSummary: 'aa B_ C_ dd E_ enen vv',
    coatDescription: 'White coat (vv) or blue self (dd) depending on V and C interplay',
    eyeColor: 'Blue (BEW when vv)',
    sources: ['Fontanesi 2014 MLPH', 'Dichrome Rabbitry V locus'],
  },
];

export const LOCI_ORDER = ['A', 'B', 'C', 'D', 'E', 'En', 'V'] as const;

/** Distinct band colors for mapped loci on the 3D chromosome models */
export const LOCUS_BAND_COLORS: Record<string, string> = {
  A: '#10b981',
  B: '#f59e0b',
  C: '#f43f5e',
  En: '#06b6d4',
};

export interface LocusBandPlacement {
  locusId: string;
  /** 0 = near centromere, 1 = telomere end of the arm */
  armPosition: number;
  /** p = short arm (positive Y), q = long arm (negative Y) */
  arm: 'p' | 'q';
}

/**
 * Approximate band positions on simplified chromosome arms — not to cytogenetic scale.
 * D, E, and V are unanchored in OryCun2.0 and have no bands.
 */
export const CHROMOSOME_LOCUS_BANDS: Record<number, LocusBandPlacement[]> = {
  1: [
    { locusId: 'C', armPosition: 0.38, arm: 'p' },
    { locusId: 'B', armPosition: 0.72, arm: 'p' },
  ],
  4: [{ locusId: 'A', armPosition: 0.52, arm: 'p' }],
  15: [{ locusId: 'En', armPosition: 0.48, arm: 'q' }],
};

export function getLocusChromosome(locusId: string): number | null {
  return RABBIT_GENETIC_MAP[locusId]?.chromosome ?? null;
}

export function getChromosomeLabel(chromosomeNumber: number): string {
  return `OCU${chromosomeNumber}`;
}

export function getLociOnChromosome(chromosomeNumber: number): Locus[] {
  return Object.values(RABBIT_GENETIC_MAP).filter((locus) => locus.chromosome === chromosomeNumber);
}

export function getLocusBandsForChromosome(chromosomeNumber: number): LocusBandPlacement[] {
  return CHROMOSOME_LOCUS_BANDS[chromosomeNumber] ?? [];
}

export function getMappedChromosomes(): number[] {
  const chromosomes = new Set<number>();
  for (const locus of Object.values(RABBIT_GENETIC_MAP)) {
    if (locus.chromosome !== null) {
      chromosomes.add(locus.chromosome);
    }
  }
  return [...chromosomes].sort((a, b) => a - b);
}

export function buildDefaultGenotypes(): Record<string, [string, string]> {
  return {
    A: ['A', 'a'],
    B: ['B', 'b'],
    C: ['C', 'c'],
    D: ['D', 'D'],
    E: ['E', 'e'],
    En: ['en', 'en'],
    V: ['V', 'V'],
  };
}

export interface ParentPreset {
  id: string;
  label: string;
  summary: string;
  genotype: Record<string, [string, string]>;
}

/** Draft genotype maps for common meat-rabbit starting points — verify before breeding use */
export const PARENT_PRESETS: ParentPreset[] = [
  {
    id: 'nz-white',
    label: 'New Zealand White',
    summary: 'aa B_ cc D_ E_ enen VV — REW commercial standard',
    genotype: {
      A: ['a', 'a'],
      B: ['B', 'B'],
      C: ['c', 'c'],
      D: ['D', 'D'],
      E: ['E', 'E'],
      En: ['en', 'en'],
      V: ['V', 'V'],
    },
  },
  {
    id: 'californian',
    label: 'Californian',
    summary: 'aa B_ chch D_ E_ enen VV — pointed white body',
    genotype: {
      A: ['a', 'a'],
      B: ['B', 'B'],
      C: ['ch', 'ch'],
      D: ['D', 'D'],
      E: ['E', 'E'],
      En: ['en', 'en'],
      V: ['V', 'V'],
    },
  },
  {
    id: 'nz-red',
    label: 'New Zealand Red',
    summary: 'A_ B_ C_ D_ ee enen VV — non-extension red',
    genotype: {
      A: ['A', 'A'],
      B: ['B', 'B'],
      C: ['C', 'C'],
      D: ['D', 'D'],
      E: ['e', 'e'],
      En: ['en', 'en'],
      V: ['V', 'V'],
    },
  },
  {
    id: 'self-black',
    label: 'Self Black',
    summary: 'aa B_ C_ D_ E_ enen VV — solid black base',
    genotype: {
      A: ['a', 'a'],
      B: ['B', 'B'],
      C: ['C', 'C'],
      D: ['D', 'D'],
      E: ['E', 'E'],
      En: ['en', 'en'],
      V: ['V', 'V'],
    },
  },
  {
    id: 'chestnut',
    label: 'Chestnut / Agouti',
    summary: 'A_ B_ C_ D_ E_ enen VV — wild-type pattern base',
    genotype: {
      A: ['A', 'A'],
      B: ['B', 'B'],
      C: ['C', 'C'],
      D: ['D', 'D'],
      E: ['E', 'E'],
      En: ['en', 'en'],
      V: ['V', 'V'],
    },
  },
  {
    id: 'broken',
    label: 'Broken / Spotted',
    summary: 'A_ B_ C_ D_ E_ Enen VV — English spotting heterozygote',
    genotype: {
      A: ['A', 'a'],
      B: ['B', 'B'],
      C: ['C', 'C'],
      D: ['D', 'D'],
      E: ['E', 'E'],
      En: ['En', 'en'],
      V: ['V', 'V'],
    },
  },
  {
    id: 'blue-vienna',
    label: 'Blue Vienna (BEW)',
    summary: 'aa B_ C_ dd E_ enen vv — Vienna blue-eyed white',
    genotype: {
      A: ['a', 'a'],
      B: ['B', 'B'],
      C: ['C', 'C'],
      D: ['d', 'd'],
      E: ['E', 'E'],
      En: ['en', 'en'],
      V: ['v', 'v'],
    },
  },
];
