import { MEAT_RABBIT_VARIETIES, PARENT_PRESETS } from './meatRabbitBreeds';

type GenotypeMap = Record<string, [string, string]>;

const PRESET_VARIETY_NAME: Record<string, string> = {
  'broken-nz-black': 'Broken New Zealand (Black)',
  'broken-nz-red': 'Broken New Zealand (Red)',
};

const PRESET_CROSS_NOTES: Record<string, string[]> = {
  'nz-white-show': [
    'Homozygous cc (albino) — pure ruby-eyed white with no hidden color or silvering alleles in this preset.',
    'Crossed to colored or silvered breeds, progeny variation comes only from the mate unless you edit alleles.',
    'Use this for intensely selected show or commercial REW lines (aa, EE, SiSi under the white coat).',
  ],
  'nz-white-field': [
    'Homozygous cc (albino) masks all underlying coat color — the rabbit looks REW regardless of A, E, or Si genotype.',
    'REW does can still carry agouti (A), red extension (e), and silvering (si) hidden under the white coat.',
    'Crossing to a full-color rabbit reveals those hidden alleles in the progeny.',
    'Field-herd scaffold (A/a, E/e, Si/si) — switch to show line preset if your herd is homozygous.',
  ],
  'nz-red': [
    'Homozygous ee blocks black extension — red/fawn shows on any agouti (A_) or self (aa) base.',
    'Crossing to E_ rabbits produces extension carriers (Ee); half the litter may look black-based if the mate carries full extension.',
  ],
  californian: [
    'Himalayan (ch) pointing is temperature-sensitive — dark nose, ears, feet, and tail on a white body.',
    'Crossed with a REW (cc), progeny are ch/c — often paler points than homozygous chch Californians.',
  ],
  himalayan: [
    'Same ch mechanism as Californian — pointed white with pink/red-tinged eyes.',
    'Crossed with cc albino, offspring are ch/c carriers with visible pointing once color is unmasked.',
  ],
  'broken-californian': [
    'En spotting overlays the Himalayan pointed base — broken pattern on pointed white.',
    'Enen × enen matings yield roughly 50% broken and 50% solid (enen) kits.',
  ],
  'silver-fox-black': [
    'Kits are born dark; heavy silver ticking develops as the coat matures (sisi).',
    'Crossing to SiSi stock produces Sisi offspring with visible light silvering, not just carrier status.',
  ],
  'champagne-dargent': [
    'Black-born like Silver Fox; silvering typically develops around 7–8 weeks.',
    'Heavy sisi expression — distinct cream/orange base of Crème d\'Argent.',
  ],
  'creme-dargent': [
    'Requires aa + ee + sisi — cream/fawn base with progressive silver tipping.',
    'Crossing a REW doe to this buck reveals hidden A, e, and si alleles from the white parent in the litter.',
  ],
  'silver-breed': [
    'Agouti-based silvering (A_ + sisi) — white ticking over chestnut pattern, not a self-black Silver Fox base.',
  ],
  'blue-vienna': [
    'Homozygous vv produces blue-eyed white (BEW) — genetically distinct from cc ruby-eyed white (REW).',
    'Vv carriers can produce BEW kits when bred to another Vienna carrier or vv rabbit.',
  ],
  steel: [
    'Steel (Es) tipping requires agouti (A_) — silver or gold guard hairs on a dark agouti coat.',
    'Es is ineffective on self (aa) rabbits; steel may be carried hidden on aa lines.',
  ],
  'checkered-giant': [
    'Large-frame broken breed — Enen produces the spotted pattern over an agouti base.',
    'Avoid EnEn × Enen or EnEn × Enen pairings (Charlie / megacolon risk).',
  ],
  'broken-generic': [
    'Enen broken spotting — roughly 50% broken kits when both parents are Enen.',
  ],
  ermine: [
    'Chinchilla modifier (cchd) on non-extension (ee) agouti — frosted pearl / ermine appearance.',
  ],
  palomino: [
    'Shaded cchl on ee agouti — golden fawn body with darker shading points.',
  ],
};

function isHomozygous(pair: [string, string] | undefined, allele: string): boolean {
  return pair !== undefined && pair[0] === allele && pair[1] === allele;
}

function carriesAllele(pair: [string, string] | undefined, allele: string): boolean {
  return pair !== undefined && (pair[0] === allele || pair[1] === allele);
}

function isHeterozygous(pair: [string, string] | undefined, a: string, b: string): boolean {
  return (
    pair !== undefined &&
    ((pair[0] === a && pair[1] === b) || (pair[0] === b && pair[1] === a))
  );
}

function findVarietyForPreset(presetId: string, label?: string) {
  const varietyName = PRESET_VARIETY_NAME[presetId] ?? label;
  if (!varietyName) return undefined;
  return MEAT_RABBIT_VARIETIES.find((entry) => entry.name === varietyName);
}

function genotypeBreedingNotes(genotype: GenotypeMap): string[] {
  const notes: string[] = [];

  if (isHomozygous(genotype.C, 'c')) {
    notes.push(
      'cc albino epistasis: underlying coat-color and silvering alleles are masked — the rabbit appears ruby-eyed white.',
    );
  } else if (carriesAllele(genotype.C, 'c')) {
    notes.push('Carries albino (c) — can produce REW kits when bred to another c carrier or cc rabbit.');
  }

  if (isHomozygous(genotype.V, 'v')) {
    notes.push('vv Vienna produces blue-eyed white — separate pathway from cc REW.');
  } else if (isHeterozygous(genotype.V, 'V', 'v')) {
    notes.push('Vienna carrier (Vv) — can throw BEW kits depending on the mate.');
  }

  if (isHomozygous(genotype.C, 'ch')) {
    notes.push('chch Himalayan — dark points on white body; pointing intensity varies with temperature.');
  } else if (carriesAllele(genotype.C, 'ch') && carriesAllele(genotype.C, 'c')) {
    notes.push('ch/c genotype — Himalayan pointing with often paler points than homozygous chch.');
  }

  if (isHomozygous(genotype.Si, 'si')) {
    notes.push('Homozygous sisi — progressive white tipping develops as the coat matures.');
  } else if (isHeterozygous(genotype.Si, 'Si', 'si')) {
    notes.push('Sisi heterozygote — light silvering is visible on the coat, not just carried invisibly.');
  }

  if (isHomozygous(genotype.E, 'e')) {
    notes.push('Homozygous ee — non-extension restricts black pigment; red/fawn or cream tones dominate.');
  }

  if (isHeterozygous(genotype.En, 'En', 'en')) {
    notes.push('Enen broken spotting — expect solid and spotted kits when bred to enen mates.');
  }

  return notes;
}

export function getPresetBreedingNotes(presetId: string | null, genotype: GenotypeMap): string[] {
  const notes: string[] = [];

  if (presetId) {
    const preset = PARENT_PRESETS.find((entry) => entry.id === presetId);
    const variety = findVarietyForPreset(presetId, preset?.label);

    if (variety) {
      notes.push(variety.coatDescription);
      notes.push(`Typical genotype: ${variety.typicalGenotypeSummary}`);
    } else if (preset) {
      notes.push(preset.summary);
    }

    const crossNotes = PRESET_CROSS_NOTES[presetId];
    if (crossNotes) {
      notes.push(...crossNotes);
    }
  } else {
    notes.push('Custom genotype — use Edit genotype below to match your rabbit\'s alleles.');
  }

  notes.push(...genotypeBreedingNotes(genotype));

  return [...new Set(notes)];
}
