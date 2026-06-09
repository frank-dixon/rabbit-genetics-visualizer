/**
 * Meat-rabbit breed varieties and parent cross presets.
 *
 * Genotype summaries are draft scaffolds from OSU Extension EM 9708, Dichrome Rabbitry,
 * Fontanesi et al., and ARBA breed standards — verify against your lines before breeding.
 */

import { type MeatRabbitVariety, type ParentPreset } from './rabbitGenetics';

type GenotypeMap = Record<string, [string, string]>;

/** Homozygous wild-type base for breed presets — distinct from heterozygous parent editor defaults */
const PRESET_BASE: GenotypeMap = {
  A: ['A', 'A'],
  B: ['B', 'B'],
  C: ['C', 'C'],
  D: ['D', 'D'],
  E: ['E', 'E'],
  En: ['en', 'en'],
  V: ['V', 'V'],
  Si: ['Si', 'Si'],
};

function genotype(overrides: Partial<GenotypeMap>): GenotypeMap {
  const base = { ...PRESET_BASE };
  for (const [locusId, pair] of Object.entries(overrides)) {
    if (pair) base[locusId] = pair;
  }
  return base;
}

export const MEAT_RABBIT_CATEGORIES = [
  'New Zealand',
  'Californian & Pointed',
  'Silver Fox',
  "d'Argent & Silvered",
  'Chinchilla',
  'Broken & Spotted',
  'Base Colors',
] as const;

export const PARENT_PRESET_CATEGORIES = MEAT_RABBIT_CATEGORIES;

export const MEAT_RABBIT_VARIETIES: MeatRabbitVariety[] = [
  // —— New Zealand ——
  {
    name: 'New Zealand White',
    category: 'New Zealand',
    typicalGenotypeSummary: 'aa B_ cc D_ E_ enen SiSi VV',
    coatDescription: 'Pure white — cc epistatic albino masks all underlying color',
    eyeColor: 'Ruby / red (REW)',
    sources: ['OMIA TYR albino', 'Fontanesi 2006 MC1R', 'OSU Extension'],
  },
  {
    name: 'New Zealand Red',
    category: 'New Zealand',
    typicalGenotypeSummary: 'A_ B_ C_ D_ ee enen SiSi VV',
    coatDescription: 'Rich red/chestnut from agouti + non-extension (ee)',
    eyeColor: 'Dark brown',
    sources: ['OSU Extension EM 9708', 'Fontanesi 2006 MC1R'],
  },
  {
    name: 'New Zealand Black',
    category: 'New Zealand',
    typicalGenotypeSummary: 'aa B_ C_ D_ E_ enen SiSi VV',
    coatDescription: 'Solid black self — non-agouti with full extension',
    eyeColor: 'Dark brown',
    sources: ['OSU Extension EM 9708'],
  },
  {
    name: 'New Zealand Blue',
    category: 'New Zealand',
    typicalGenotypeSummary: 'aa B_ C_ dd E_ enen SiSi VV',
    coatDescription: 'Dilute black — blue-gray self',
    eyeColor: 'Dark brown',
    sources: ['OSU Extension EM 9708', 'Fontanesi 2014 MLPH'],
  },
  {
    name: 'Broken New Zealand (Black)',
    category: 'New Zealand',
    typicalGenotypeSummary: 'aa B_ C_ D_ E_ Enen SiSi VV',
    coatDescription: 'Black patches on white — En spotting over self black base',
    eyeColor: 'Dark brown',
    sources: ['OSU Extension EM 9708', 'Fontanesi 2014 KIT'],
  },
  {
    name: 'Broken New Zealand (Red)',
    category: 'New Zealand',
    typicalGenotypeSummary: 'A_ B_ C_ D_ ee Enen SiSi VV',
    coatDescription: 'Red/fawn patches on white — En spotting over non-extension base',
    eyeColor: 'Dark brown',
    sources: ['OSU Extension EM 9708', 'Fontanesi 2014 KIT'],
  },

  // —— Californian & Pointed ——
  {
    name: 'Californian',
    category: 'Californian & Pointed',
    typicalGenotypeSummary: 'aa B_ chch D_ E_ enen SiSi VV',
    coatDescription: 'White body with dark points (nose, ears, feet, tail)',
    eyeColor: 'Pink / red-tinged (Himalayan)',
    sources: ['OSU Extension Part 3', 'Fontanesi 2006 MC1R'],
  },
  {
    name: 'Broken Californian',
    category: 'Californian & Pointed',
    typicalGenotypeSummary: 'aa B_ chch D_ E_ Enen SiSi VV',
    coatDescription: 'Himalayan-pointed patches on white — broken spotting over Californian base',
    eyeColor: 'Pink / red-tinged (Himalayan)',
    sources: ['OSU Extension EM 9708', 'Fontanesi 2014 KIT'],
  },
  {
    name: 'Himalayan',
    category: 'Californian & Pointed',
    typicalGenotypeSummary: 'aa B_ chch D_ E_ enen SiSi VV',
    coatDescription: 'Pointed white breed — same Himalayan (ch) mechanism as Californian',
    eyeColor: 'Pink / red-tinged',
    sources: ['OSU Extension Part 3'],
  },

  // —— Silver Fox ——
  {
    name: 'Silver Fox (Black)',
    category: 'Silver Fox',
    typicalGenotypeSummary: 'aa B_ C_ D_ E_ enen sisi VV',
    coatDescription:
      'Born black; progressive silver ticking from sisi. Es steel may be carried hidden on aa selfs.',
    eyeColor: 'Dark brown',
    sources: ['OSU Extension EM 9708', 'Dichrome Rabbitry Si locus', 'ARBA Silver Fox'],
  },
  {
    name: 'Silver Fox (Blue)',
    category: 'Silver Fox',
    typicalGenotypeSummary: 'aa B_ C_ dd E_ enen sisi VV',
    coatDescription: 'Dilute black base with heavy silvering — blue-gray mature coat',
    eyeColor: 'Dark brown',
    sources: ['OSU Extension EM 9708', 'Dichrome Rabbitry', 'ARBA Silver Fox'],
  },
  {
    name: 'Silver Fox (Chocolate)',
    category: 'Silver Fox',
    typicalGenotypeSummary: 'aa bb C_ D_ E_ enen sisi VV',
    coatDescription: 'Chocolate brown base with progressive silver tipping',
    eyeColor: 'Dark brown',
    sources: ['OSU Extension EM 9708', 'ARBA Silver Fox'],
  },
  {
    name: 'Silver Fox (Lilac)',
    category: 'Silver Fox',
    typicalGenotypeSummary: 'aa bb C_ dd E_ enen sisi VV',
    coatDescription: 'Dilute chocolate base with silver ticking — lilac-gray mature coat',
    eyeColor: 'Dark brown',
    sources: ['OSU Extension EM 9708', 'ARBA Silver Fox'],
  },

  // —— d'Argent & Silvered ——
  {
    name: "Champagne d'Argent",
    category: "d'Argent & Silvered",
    typicalGenotypeSummary: 'aa B_ C_ D_ E_ enen sisi VV',
    coatDescription:
      'Born black; silvering develops from ~7–8 weeks. Heavier silver expression than Silver Fox in many lines.',
    eyeColor: 'Dark brown',
    sources: ['Dichrome Rabbitry Si locus', 'Raising-Rabbits Champagne d\'Argent', 'OSU Extension'],
  },
  {
    name: "Crème d'Argent",
    category: "d'Argent & Silvered",
    typicalGenotypeSummary: 'aa B_ C_ D_ ee enen sisi VV',
    coatDescription:
      'Creamy orange/fawn base (ee) with progressive silver ticking — commercial meat body type',
    eyeColor: 'Dark brown',
    sources: ['Dichrome Rabbitry Si locus', 'ARBA Crème d\'Argent', 'RabbitTalk d\'Argent genetics'],
  },
  {
    name: 'Argente Brun',
    category: "d'Argent & Silvered",
    typicalGenotypeSummary: 'aa bb C_ D_ E_ enen sisi VV',
    coatDescription: 'Chocolate-based silvered argente — related to Champagne foundation genetics',
    eyeColor: 'Dark brown',
    sources: ['Dichrome Rabbitry', 'Raising-Rabbits Argente breeds'],
  },
  {
    name: 'Argente Bleu',
    category: "d'Argent & Silvered",
    typicalGenotypeSummary: 'aa B_ C_ dd E_ enen sisi VV',
    coatDescription: 'Blue (dilute black) silvered argente',
    eyeColor: 'Dark brown',
    sources: ['Dichrome Rabbitry', 'Raising-Rabbits Argente breeds'],
  },
  {
    name: 'Silver (Breed)',
    category: "d'Argent & Silvered",
    typicalGenotypeSummary: 'A_ B_ C_ D_ E_ enen sisi VV',
    coatDescription:
      'Agouti-based silvered breed — white ticking over wild-type pattern (distinct from Silver Fox self base)',
    eyeColor: 'Dark brown',
    sources: ['OSU Extension EM 9708', 'Dichrome Rabbitry Si locus'],
  },

  // —— Chinchilla ——
  {
    name: 'American Chinchilla',
    category: 'Chinchilla',
    typicalGenotypeSummary: 'A_ B_ cchd_ D_ E_ enen SiSi VV',
    coatDescription: 'Agouti with dark chinchilla — pearl banding, commercial meat breed',
    eyeColor: 'Dark brown',
    sources: ['OSU Extension EM 9708'],
  },
  {
    name: 'Giant Chinchilla',
    category: 'Chinchilla',
    typicalGenotypeSummary: 'A_ B_ cchd_ D_ E_ enen SiSi VV',
    coatDescription: 'Large commercial chinchilla — same cchd modifier on agouti base',
    eyeColor: 'Dark brown',
    sources: ['OSU Extension EM 9708', 'Fontanesi 2006 MC1R'],
  },
  {
    name: 'Sable / Siamese Sable',
    category: 'Chinchilla',
    typicalGenotypeSummary: 'A_ B_ cchl_ D_ E_ enen SiSi VV',
    coatDescription: 'Shaded chinchilla light — darker points, lighter body',
    eyeColor: 'Dark brown',
    sources: ['OSU Extension EM 9708'],
  },
  {
    name: 'Ermine / Frosted Pearl',
    category: 'Chinchilla',
    typicalGenotypeSummary: 'A_ B_ cchd_ D_ ee enen SiSi VV',
    coatDescription: 'Chinchilla dark on non-extension (ee) agouti — frosted pearl/ermine',
    eyeColor: 'Dark brown',
    sources: ['OSU Extension EM 9708'],
  },

  // —— Broken & Spotted ——
  {
    name: 'Checkered Giant (Broken)',
    category: 'Broken & Spotted',
    typicalGenotypeSummary: 'A_ B_ C_ D_ E_ Enen SiSi VV',
    coatDescription: 'Large spotted meat/show type — Enen broken pattern',
    eyeColor: 'Dark brown',
    sources: ['OSU Extension EM 9708', 'Fontanesi 2014 KIT'],
  },
  {
    name: 'Charlie (EnEn)',
    category: 'Broken & Spotted',
    typicalGenotypeSummary: 'A_ B_ C_ D_ E_ EnEn SiSi VV',
    coatDescription:
      'Nearly all white from homozygous English spotting — often subvital; welfare concern in breeding',
    eyeColor: 'Dark brown',
    sources: ['OSU Extension EM 9708', 'Fontanesi 2014 KIT'],
  },
  {
    name: 'Steel / Silver-Tipped',
    category: 'Broken & Spotted',
    typicalGenotypeSummary: 'A_ B_ C_ D_ Es_ enen SiSi VV',
    coatDescription:
      'Steel (Es) requires agouti (A_) — dark coat with silver or gold guard hair tipping',
    eyeColor: 'Dark brown',
    sources: ['OSU Extension EM 9708 Part 2'],
  },

  // —— Base Colors ——
  {
    name: 'Self Black',
    category: 'Base Colors',
    typicalGenotypeSummary: 'aa B_ C_ D_ E_ enen SiSi VV',
    coatDescription: 'Solid black — foundation for many commercial and specialty lines',
    eyeColor: 'Dark brown',
    sources: ['OSU Extension EM 9708'],
  },
  {
    name: 'Chestnut / Agouti',
    category: 'Base Colors',
    typicalGenotypeSummary: 'A_ B_ C_ D_ E_ enen SiSi VV',
    coatDescription: 'Wild-type agouti banding — castor/chestnut',
    eyeColor: 'Dark brown',
    sources: ['OSU Extension EM 9708'],
  },
  {
    name: 'Blue Vienna (BEW)',
    category: 'Base Colors',
    typicalGenotypeSummary: 'aa B_ C_ dd E_ enen SiSi vv',
    coatDescription: 'Vienna blue-eyed white — vv overrides coat to white with blue eyes',
    eyeColor: 'Blue (BEW)',
    sources: ['Fontanesi 2014 MLPH', 'Dichrome Rabbitry V locus'],
  },
  {
    name: 'Chocolate Self',
    category: 'Base Colors',
    typicalGenotypeSummary: 'aa bb C_ D_ E_ enen SiSi VV',
    coatDescription: 'Havana-type chocolate brown self',
    eyeColor: 'Dark brown',
    sources: ['OSU Extension EM 9708', 'OMIA TYRP1 brown'],
  },
  {
    name: 'Lilac Self',
    category: 'Base Colors',
    typicalGenotypeSummary: 'aa bb C_ dd E_ enen SiSi VV',
    coatDescription: 'Dilute chocolate — lilac/gray self',
    eyeColor: 'Dark brown',
    sources: ['OSU Extension EM 9708', 'Fontanesi 2014 MLPH'],
  },
  {
    name: 'Palomino',
    category: 'Base Colors',
    typicalGenotypeSummary: 'A_ B_ cchl_ D_ ee enen SiSi VV',
    coatDescription: 'Golden fawn from non-extension (ee) with shaded chinchilla modifier',
    eyeColor: 'Dark brown',
    sources: ['OSU Extension EM 9708'],
  },
];

export const PARENT_PRESETS: ParentPreset[] = [
  // New Zealand
  {
    id: 'nz-white',
    category: 'New Zealand',
    label: 'New Zealand White',
    summary:
      'A/a B_ cc D_ E/e enen Si/si VV — REW; cc masks hidden agouti, red, and silver carriers (field-herd scaffold)',
    genotype: genotype({
      A: ['A', 'a'],
      C: ['c', 'c'],
      E: ['E', 'e'],
      Si: ['Si', 'si'],
    }),
  },
  {
    id: 'nz-red',
    category: 'New Zealand',
    label: 'New Zealand Red',
    summary: 'A_ B_ C_ D_ ee enen SiSi VV — non-extension red',
    genotype: genotype({ A: ['A', 'A'], E: ['e', 'e'] }),
  },
  {
    id: 'nz-black',
    category: 'New Zealand',
    label: 'New Zealand Black',
    summary: 'aa B_ C_ D_ E_ enen SiSi VV — solid black',
    genotype: genotype({ A: ['a', 'a'] }),
  },
  {
    id: 'nz-blue',
    category: 'New Zealand',
    label: 'New Zealand Blue',
    summary: 'aa B_ C_ dd E_ enen SiSi VV — dilute black',
    genotype: genotype({ A: ['a', 'a'], D: ['d', 'd'] }),
  },
  {
    id: 'broken-nz-black',
    category: 'New Zealand',
    label: 'Broken NZ (Black)',
    summary: 'aa B_ C_ D_ E_ Enen SiSi VV — spotted black on white',
    genotype: genotype({ A: ['a', 'a'], En: ['En', 'en'] }),
  },
  {
    id: 'broken-nz-red',
    category: 'New Zealand',
    label: 'Broken NZ (Red)',
    summary: 'A_ B_ C_ D_ ee Enen SiSi VV — spotted red on white',
    genotype: genotype({ A: ['A', 'A'], E: ['e', 'e'], En: ['En', 'en'] }),
  },

  // Californian & Pointed
  {
    id: 'californian',
    category: 'Californian & Pointed',
    label: 'Californian',
    summary: 'aa B_ chch D_ E_ enen SiSi VV — pointed white',
    genotype: genotype({ A: ['a', 'a'], C: ['ch', 'ch'] }),
  },
  {
    id: 'broken-californian',
    category: 'Californian & Pointed',
    label: 'Broken Californian',
    summary: 'aa B_ chch D_ E_ Enen SiSi VV — broken Himalayan',
    genotype: genotype({ A: ['a', 'a'], C: ['ch', 'ch'], En: ['En', 'en'] }),
  },
  {
    id: 'himalayan',
    category: 'Californian & Pointed',
    label: 'Himalayan',
    summary: 'aa B_ chch D_ E_ enen SiSi VV — pointed white breed',
    genotype: genotype({ A: ['a', 'a'], C: ['ch', 'ch'] }),
  },

  // Silver Fox
  {
    id: 'silver-fox-black',
    category: 'Silver Fox',
    label: 'Silver Fox (Black)',
    summary: 'aa B_ C_ D_ E_ enen sisi VV — silvered black',
    genotype: genotype({ A: ['a', 'a'], Si: ['si', 'si'] }),
  },
  {
    id: 'silver-fox-blue',
    category: 'Silver Fox',
    label: 'Silver Fox (Blue)',
    summary: 'aa B_ C_ dd E_ enen sisi VV — silvered blue',
    genotype: genotype({ A: ['a', 'a'], D: ['d', 'd'], Si: ['si', 'si'] }),
  },
  {
    id: 'silver-fox-chocolate',
    category: 'Silver Fox',
    label: 'Silver Fox (Chocolate)',
    summary: 'aa bb C_ D_ E_ enen sisi VV — silvered chocolate',
    genotype: genotype({ A: ['a', 'a'], B: ['b', 'b'], Si: ['si', 'si'] }),
  },
  {
    id: 'silver-fox-lilac',
    category: 'Silver Fox',
    label: 'Silver Fox (Lilac)',
    summary: 'aa bb C_ dd E_ enen sisi VV — silvered lilac',
    genotype: genotype({ A: ['a', 'a'], B: ['b', 'b'], D: ['d', 'd'], Si: ['si', 'si'] }),
  },

  // d'Argent & Silvered
  {
    id: 'champagne-dargent',
    category: "d'Argent & Silvered",
    label: "Champagne d'Argent",
    summary: 'aa B_ C_ D_ E_ enen sisi VV — black-born silvered argente',
    genotype: genotype({ A: ['a', 'a'], Si: ['si', 'si'] }),
  },
  {
    id: 'creme-dargent',
    category: "d'Argent & Silvered",
    label: "Crème d'Argent",
    summary: 'aa B_ C_ D_ ee enen sisi VV — cream/orange silvered',
    genotype: genotype({ A: ['a', 'a'], E: ['e', 'e'], Si: ['si', 'si'] }),
  },
  {
    id: 'argente-brun',
    category: "d'Argent & Silvered",
    label: 'Argente Brun',
    summary: 'aa bb C_ D_ E_ enen sisi VV — chocolate silvered',
    genotype: genotype({ A: ['a', 'a'], B: ['b', 'b'], Si: ['si', 'si'] }),
  },
  {
    id: 'argente-bleu',
    category: "d'Argent & Silvered",
    label: 'Argente Bleu',
    summary: 'aa B_ C_ dd E_ enen sisi VV — blue silvered',
    genotype: genotype({ A: ['a', 'a'], D: ['d', 'd'], Si: ['si', 'si'] }),
  },
  {
    id: 'silver-breed',
    category: "d'Argent & Silvered",
    label: 'Silver (Breed)',
    summary: 'A_ B_ C_ D_ E_ enen sisi VV — agouti silvered',
    genotype: genotype({ A: ['A', 'A'], Si: ['si', 'si'] }),
  },

  // Chinchilla
  {
    id: 'american-chinchilla',
    category: 'Chinchilla',
    label: 'American Chinchilla',
    summary: 'A_ B_ cchd_ D_ E_ enen SiSi VV — dark chinchilla agouti',
    genotype: genotype({ A: ['A', 'A'], C: ['cchd', 'cchd'] }),
  },
  {
    id: 'giant-chinchilla',
    category: 'Chinchilla',
    label: 'Giant Chinchilla',
    summary: 'A_ B_ cchd_ D_ E_ enen SiSi VV — large commercial chinchilla',
    genotype: genotype({ A: ['A', 'A'], C: ['cchd', 'cchd'] }),
  },
  {
    id: 'sable',
    category: 'Chinchilla',
    label: 'Sable / Siamese Sable',
    summary: 'A_ B_ cchl_ D_ E_ enen SiSi VV — shaded chinchilla',
    genotype: genotype({ A: ['A', 'A'], C: ['cchl', 'cchl'] }),
  },
  {
    id: 'ermine',
    category: 'Chinchilla',
    label: 'Ermine / Frosted Pearl',
    summary: 'A_ B_ cchd_ D_ ee enen SiSi VV — chinchilla on ee',
    genotype: genotype({ A: ['A', 'A'], C: ['cchd', 'cchd'], E: ['e', 'e'] }),
  },

  // Broken & Spotted
  {
    id: 'checkered-giant',
    category: 'Broken & Spotted',
    label: 'Checkered Giant',
    summary: 'A_ B_ C_ D_ E_ Enen SiSi VV — large broken pattern',
    genotype: genotype({ A: ['A', 'a'], En: ['En', 'en'] }),
  },
  {
    id: 'broken-generic',
    category: 'Broken & Spotted',
    label: 'Broken / Spotted',
    summary: 'A_ B_ C_ D_ E_ Enen SiSi VV — En spotting heterozygote',
    genotype: genotype({ A: ['A', 'a'], En: ['En', 'en'] }),
  },
  {
    id: 'steel',
    category: 'Broken & Spotted',
    label: 'Steel / Silver-Tipped',
    summary: 'A_ B_ C_ D_ Es_ enen SiSi VV — steel guard hairs on agouti',
    genotype: genotype({ A: ['A', 'A'], E: ['Es', 'E'] }),
  },

  // Base Colors
  {
    id: 'self-black',
    category: 'Base Colors',
    label: 'Self Black',
    summary: 'aa B_ C_ D_ E_ enen SiSi VV — solid black base',
    genotype: genotype({ A: ['a', 'a'] }),
  },
  {
    id: 'chestnut',
    category: 'Base Colors',
    label: 'Chestnut / Agouti',
    summary: 'A_ B_ C_ D_ E_ enen SiSi VV — wild-type pattern',
    genotype: genotype({ A: ['A', 'A'] }),
  },
  {
    id: 'chocolate-self',
    category: 'Base Colors',
    label: 'Chocolate Self',
    summary: 'aa bb C_ D_ E_ enen SiSi VV — Havana chocolate',
    genotype: genotype({ A: ['a', 'a'], B: ['b', 'b'] }),
  },
  {
    id: 'lilac-self',
    category: 'Base Colors',
    label: 'Lilac Self',
    summary: 'aa bb C_ dd E_ enen SiSi VV — dilute chocolate',
    genotype: genotype({ A: ['a', 'a'], B: ['b', 'b'], D: ['d', 'd'] }),
  },
  {
    id: 'blue-vienna',
    category: 'Base Colors',
    label: 'Blue Vienna (BEW)',
    summary: 'aa B_ C_ dd E_ enen SiSi vv — Vienna blue-eyed white',
    genotype: genotype({ A: ['a', 'a'], D: ['d', 'd'], V: ['v', 'v'] }),
  },
  {
    id: 'palomino',
    category: 'Base Colors',
    label: 'Palomino',
    summary: 'A_ B_ cchl_ D_ ee enen SiSi VV — golden fawn',
    genotype: genotype({ A: ['A', 'A'], C: ['cchl', 'cchl'], E: ['e', 'e'] }),
  },
];
