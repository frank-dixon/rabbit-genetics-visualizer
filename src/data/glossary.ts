export interface GlossaryEntry {
  term: string;
  definition: string;
}

export interface GlossarySection {
  id: string;
  title: string;
  entries: GlossaryEntry[];
}

export const GLOSSARY_SECTIONS: GlossarySection[] = [
  {
    id: 'basics',
    title: 'Genetics basics',
    entries: [
      {
        term: 'Locus (plural: loci)',
        definition:
          'A specific place on a chromosome where a gene affecting coat or eye color sits. This app tracks eight loci: A, B, C, D, E, En, V, and Si.',
      },
      {
        term: 'Allele',
        definition:
          'One version of a gene at a locus. Rabbits inherit two alleles per locus — one from each parent. Examples: C (full color) vs c (albino) at the C locus.',
      },
      {
        term: 'Genotype',
        definition:
          'The rabbit’s genetic makeup — the combination of alleles at each locus (e.g. aa Bb cc Dd Ee). Written with locus labels in this tool; homozygous pairs show one code (A:a), heterozygous pairs show both (C:C/c).',
      },
      {
        term: 'Phenotype',
        definition:
          'What the rabbit actually looks like — coat color, pattern, silvering, and eye color — as produced by the genotype and how loci interact.',
      },
      {
        term: 'Homozygous',
        definition:
          'Both alleles at a locus are the same (e.g. aa, cc, sisi). Recessive traits like albino (cc) or silvering (sisi) usually require homozygosity to show fully.',
      },
      {
        term: 'Heterozygous',
        definition:
          'The two alleles at a locus differ (e.g. Aa, C/c, Sisi). The more dominant allele typically controls the visible trait, though some loci show incomplete dominance (especially C).',
      },
      {
        term: 'Dominant / recessive',
        definition:
          'Dominant alleles express when at least one copy is present (A_). Recessive alleles need two copies to show (aa, cc, ee). Dominance order varies by locus — see each locus below.',
      },
      {
        term: 'Carrier',
        definition:
          'A rabbit heterozygous for a recessive allele (e.g. C/c for albino, Si/si for silvering) that does not fully express the recessive phenotype but can pass it to offspring.',
      },
      {
        term: 'Epistasis',
        definition:
          'When one gene masks another. The most important example here: homozygous cc (albino) hides all underlying coat color and silvering — the rabbit looks white regardless of A, E, or Si genotype.',
      },
      {
        term: 'Cross / progeny',
        definition:
          'A mating between two parents. This tool calculates offspring genotype probabilities by combining one allele from each parent at every locus (Punnett-style), then resolves the predicted phenotype.',
      },
      {
        term: 'Incomplete dominance',
        definition:
          'Heterozygotes show a blend or intermediate phenotype rather than the full dominant type. Common among C-locus alleles (e.g. ch/c often has paler pointing than chch).',
      },
    ],
  },
  {
    id: 'patterns',
    title: 'Coat patterns & color terms',
    entries: [
      {
        term: 'Self / solid (aa)',
        definition:
          'Non-agouti pattern — one uniform color over the body with no wild-type banding on the hairs. “Self black” means solid black (aa with full black extension). NZ Black, Californian base, and Silver Fox at birth are self-patterned.',
      },
      {
        term: 'Agouti / chestnut (A_)',
        definition:
          'Wild-type banding on each hair shaft with a lighter belly. Produces castor, chestnut, or opal coats depending on B, D, and E. NZ Red and the Silver breed use agouti-based genetics.',
      },
      {
        term: 'Otter / tan (at_)',
        definition:
          'Dark top color with a contrasting lighter underside, eye circles, and insides of ears — between agouti and self in dominance at the A locus.',
      },
      {
        term: 'Broken / spotted (Enen)',
        definition:
          'White patches mixed with colored areas from the English spotting (En) gene. Broken NZ and Checkered Giant are Enen. Breeding two broken rabbits yields roughly half broken, half solid kits.',
      },
      {
        term: 'Charlie (EnEn)',
        definition:
          'Homozygous English spotting — mostly white with very little color, often linked to health issues (megacolon). Avoid EnEn × Enen or EnEn × EnEn matings.',
      },
      {
        term: 'Himalayan / pointed white (ch_)',
        definition:
          'Temperature-sensitive pattern: dark nose, ears, feet, and tail on a white body. Californian and Himalayan breeds. ch/c heterozygotes (from REW × pointed crosses) often show paler points than chch.',
      },
      {
        term: 'Chinchilla (cchd_)',
        definition:
          'Replaces yellow/red bands with pearl or white on agouti hairs. American and Giant Chinchilla meat breeds. Combined with ee gives frosted pearl / ermine types.',
      },
      {
        term: 'Shaded / sable (cchl_)',
        definition:
          'Lightens overall body color while keeping darker shading on points. Sable and Siamese sable varieties.',
      },
      {
        term: 'Dilute (dd)',
        definition:
          'Recessive dilution at the D locus — softens pigment density. Black becomes blue (gray), chocolate becomes lilac. NZ Blue is aa dd self.',
      },
      {
        term: 'Non-extension (ee)',
        definition:
          'Restricts black pigment extension, allowing red, fawn, or cream tones. NZ Red is ee on an agouti base; Crème d’Argent is ee on a self (aa) base with silvering.',
      },
      {
        term: 'Steel (Es)',
        definition:
          'Silver or gold guard-hair tipping on an agouti (A_) coat. Ineffective on self (aa) rabbits — steel can be carried hidden on self lines.',
      },
      {
        term: 'Silvering (sisi / Sisi)',
        definition:
          'Progressive white tipping of guard hairs as the coat matures. sisi = heavy silvering (Silver Fox, Champagne d’Argent, Crème d’Argent). Sisi = lighter visible tipping, not invisible carriage. Invisible on cc REW or vv BEW coats.',
      },
      {
        term: 'Ruby-Eyed White (REW)',
        definition:
          'Homozygous cc albino — pure white coat, ruby/red eyes. Masks all other color genes visually. New Zealand White commercial standard. Not the same as Vienna blue-eyed white.',
      },
      {
        term: 'Blue-Eyed White (BEW)',
        definition:
          'Homozygous vv at the Vienna (V) locus — white coat with blue eyes. Separate genetic pathway from cc REW. Blue Vienna breed.',
      },
      {
        term: 'Hidden carrier (under cc)',
        definition:
          'A REW rabbit (cc) can carry agouti (A), red extension (e), silvering (si), or other alleles without showing them. Crossing to a full-color mate reveals those alleles in the litter.',
      },
    ],
  },
  {
    id: 'eyes',
    title: 'Eye color',
    entries: [
      {
        term: 'Dark / brown eyes',
        definition:
          'Normal full-color eyes on C_ V_ rabbits with adequate iris pigment. Standard for NZ Black, NZ Red, Silver Fox, and most colored commercial lines.',
      },
      {
        term: 'Ruby / red eyes',
        definition:
          'No iris pigment — blood vessels show through (cc albino). Bright red appearance. Defining trait of REW.',
      },
      {
        term: 'Blue eyes (Vienna)',
        definition:
          'Clear blue iris from vv Vienna homozygosity — distinct from ruby REW eyes.',
      },
      {
        term: 'Pink / Himalayan eyes',
        definition:
          'Reduced pigment typical of ch_ pointed whites — pink to red-tinged, generally lighter than full REW ruby.',
      },
      {
        term: 'Vienna carrier (Vv)',
        definition:
          'Heterozygous Vienna — may be genetically hidden or show as Vienna Marked (white patches) with variable eye color. Can produce BEW kits when bred to another carrier or vv rabbit.',
      },
    ],
  },
  {
    id: 'locus-a',
    title: 'A locus — Agouti (pattern)',
    entries: [
      {
        term: 'A (agouti)',
        definition: 'Dominant wild-type — banded hairs, lighter belly. Required for chestnut, opal, and agouti-based silver breeds.',
      },
      {
        term: 'at (tan / otter)',
        definition: 'Recessive to A — dark top with light underside and eye rings.',
      },
      {
        term: 'a (self / non-agouti)',
        definition: 'Recessive — solid one-color coat. Required for self black, blue, chocolate, lilac, and pointed Californian-type bases.',
      },
    ],
  },
  {
    id: 'locus-b',
    title: 'B locus — Brown / black base',
    entries: [
      {
        term: 'B (black pigment)',
        definition: 'Dominant — eumelanin is black. Standard in NZ White, Californian, and most commercial lines.',
      },
      {
        term: 'b (chocolate)',
        definition: 'Recessive — brown/chocolate eumelanin only. Homozygous bb on a self base gives chocolate or lilac (with dd).',
      },
    ],
  },
  {
    id: 'locus-c',
    title: 'C locus — Color depth (TYR)',
    entries: [
      {
        term: 'C (full color)',
        definition: 'Normal tyrosinase — all other color loci can express.',
      },
      {
        term: 'cchd (chinchilla dark)',
        definition: 'Dominant over cchl, ch, c — pearl/white replaces red bands on agouti.',
      },
      {
        term: 'cchl (shaded / sable)',
        definition: 'Light chinchilla — shaded body, darker points.',
      },
      {
        term: 'ch (Himalayan)',
        definition: 'Temperature-sensitive pointing — Californian mechanism.',
      },
      {
        term: 'c (albino / REW)',
        definition: 'Recessive — no melanin in coat; epistatic to all other color loci. Ruby eyes when V_.',
      },
    ],
  },
  {
    id: 'locus-d',
    title: 'D locus — Dilute',
    entries: [
      {
        term: 'D (dense)',
        definition: 'Full pigment strength. Wild-type for commercial NZ and Californian lines.',
      },
      {
        term: 'd (dilute)',
        definition: 'Recessive — dilutes black to blue and chocolate to lilac.',
      },
    ],
  },
  {
    id: 'locus-e',
    title: 'E locus — Extension (MC1R)',
    entries: [
      {
        term: 'Ed (dominant extension)',
        definition: 'Forces black extension — rare in commercial stock.',
      },
      {
        term: 'Es (steel)',
        definition: 'Steel tipping — requires agouti (A_).',
      },
      {
        term: 'E (normal extension)',
        definition: 'Wild-type — allows A, B, C, D to determine color. Commercial NZ White and Californian use E_ with aa self for black-based coats.',
      },
      {
        term: 'e (non-extension)',
        definition: 'Recessive — red, fawn, cream, or orange tones. NZ Red and Crème d’Argent.',
      },
    ],
  },
  {
    id: 'locus-en',
    title: 'En locus — English spotting',
    entries: [
      {
        term: 'En (spotting)',
        definition: 'Dominant — Enen broken pattern; EnEn Charlie (mostly white).',
      },
      {
        term: 'en (solid)',
        definition: 'Recessive — no white spotting. Solid commercial appearance.',
      },
    ],
  },
  {
    id: 'locus-v',
    title: 'V locus — Vienna',
    entries: [
      {
        term: 'V (non-Vienna)',
        definition: 'Normal pigment pathway. Required for standard REW and colored varieties.',
      },
      {
        term: 'v (Vienna)',
        definition: 'vv = blue-eyed white. Vv = carrier or Vienna Marked with variable expression.',
      },
    ],
  },
  {
    id: 'locus-si',
    title: 'Si locus — Silvering',
    entries: [
      {
        term: 'Si (non-silvered)',
        definition: 'No progressive white tipping. Standard NZ White, Californian, NZ Red commercial lines.',
      },
      {
        term: 'si (silvered)',
        definition: 'Progressive white guard-hair tipping. Defining for Silver Fox, d’Argent breeds, and Silver breed.',
      },
    ],
  },
  {
    id: 'breeds',
    title: 'Breed & variety terms',
    entries: [
      {
        term: 'Variety preset',
        definition:
          'A starting genotype scaffold for a meat-rabbit breed or color variety. Edit alleles if your line differs — presets are planning aids, not ARBA certificates.',
      },
      {
        term: 'd’Argent',
        definition:
          'Family of silvered breeds — Champagne (black-born silver), Crème (cream/fawn + silver), Argente Brun/Bleu, and related lines. All rely on sisi silvering.',
      },
      {
        term: 'Silver Fox',
        definition:
          'Self (aa) black-born breed with heavy sisi silvering developing over time. Distinct from the agouti-based Silver breed.',
      },
      {
        term: 'Californian',
        definition:
          'Pointed white meat breed — aa chch with pink-tinged eyes and dark points. Often crossed with NZ White in commercial programs.',
      },
      {
        term: 'New Zealand (NZ)',
        definition:
          'Primary US commercial meat-rabbit family — White (REW/cc), Red (ee agouti), Black (aa self), Blue (aa dd), and broken varieties.',
      },
      {
        term: 'Genotype variant',
        definition:
          'In progeny results, rabbits that look the same phenotypically but differ at one or more loci. Differing alleles are highlighted in amber in the genotype display.',
      },
    ],
  },
];
