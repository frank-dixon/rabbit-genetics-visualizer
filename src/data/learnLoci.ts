export interface LearnLocusPreset {
  id: string;
  name: string;
  shortLabel: string;
  dominantAllele: string;
  recessiveAllele: string;
  dominanceHierarchy: [string, string];
  genotypes: [string, string, string];
  phenotypeDominant: string;
  phenotypeRecessive: string;
  dominantSummary: string;
  recessiveSummary: string;
  rabbitNote: string;
}

export const LEARN_LOCUS_PRESETS: LearnLocusPreset[] = [
  {
    id: 'B',
    name: 'B locus — Black vs chocolate',
    shortLabel: 'B (black / chocolate)',
    dominantAllele: 'B',
    recessiveAllele: 'b',
    dominanceHierarchy: ['B', 'b'],
    genotypes: ['BB', 'Bb', 'bb'],
    phenotypeDominant: 'Black base pigment (B_)',
    phenotypeRecessive: 'Chocolate base pigment (bb)',
    dominantSummary: 'B is dominant — one copy is enough for black pigment.',
    recessiveSummary: 'b is recessive — chocolate only shows when both alleles are b.',
    rabbitNote:
      'TYRP1 on rabbit chromosome 1. Most commercial meat lines are B_; chocolate (bb) is the classic Havana brown.',
  },
  {
    id: 'D',
    name: 'D locus — Dense vs dilute',
    shortLabel: 'D (dense / dilute)',
    dominantAllele: 'D',
    recessiveAllele: 'd',
    dominanceHierarchy: ['D', 'd'],
    genotypes: ['DD', 'Dd', 'dd'],
    phenotypeDominant: 'Dense pigment (not diluted)',
    phenotypeRecessive: 'Dilute modifier (dd)',
    dominantSummary: 'D keeps pigment intense — black stays black, chocolate stays chocolate.',
    recessiveSummary:
      'dd dilutes whatever base color is present — black becomes blue, chocolate becomes lilac.',
    rabbitNote:
      'MLPH dilute locus. Works with B and other loci; this square isolates D alone for learning.',
  },
  {
    id: 'pea',
    name: 'Mendel\'s peas (illustration)',
    shortLabel: 'Seed color (Y / y)',
    dominantAllele: 'Y',
    recessiveAllele: 'y',
    dominanceHierarchy: ['Y', 'y'],
    genotypes: ['YY', 'Yy', 'yy'],
    phenotypeDominant: 'Yellow seeds',
    phenotypeRecessive: 'Green seeds',
    dominantSummary: 'Y (yellow) is dominant over y (green) in Mendel\'s famous pea crosses.',
    recessiveSummary: 'yy homozygotes are the only green seeds in complete dominance.',
    rabbitNote:
      'Not a rabbit gene — included so you can reproduce Mendel\'s 3:1 monohybrid ratio on the same grid.',
  },
];

export function getLearnLocusPreset(id: string): LearnLocusPreset {
  return LEARN_LOCUS_PRESETS.find((preset) => preset.id === id) ?? LEARN_LOCUS_PRESETS[0];
}
