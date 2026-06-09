import { LOCI_ORDER, RABBIT_GENETIC_MAP, buildDefaultGenotypes } from '../data/rabbitGenetics';
import { PARENT_PRESETS } from '../data/meatRabbitBreeds';
import type { AlleleConfidence, LocusGenotypeRecord, LocusRecord } from '../types/stockRabbit';
type GenotypeMap = Record<string, [string, string]>;

function defaultLocusRecord(locusId: string): LocusRecord {
  const defaults = buildDefaultGenotypes();
  return {
    alleles: defaults[locusId] ?? null,
    confidence: 'guessed',
  };
}

export function buildEmptyLocusRecord(): LocusGenotypeRecord {
  return Object.fromEntries(LOCI_ORDER.map((locusId) => [locusId, defaultLocusRecord(locusId)]));
}

export function lociFromPreset(presetId: string): LocusGenotypeRecord {
  const preset = PARENT_PRESETS.find((entry) => entry.id === presetId);
  const record = buildEmptyLocusRecord();
  if (!preset) return record;

  for (const locusId of LOCI_ORDER) {
    const pair = preset.genotype[locusId];
    if (pair) {
      record[locusId] = { alleles: [...pair] as [string, string], confidence: 'likely' };
    }
  }
  return record;
}

export function resolveGenotypeFromLoci(loci: LocusGenotypeRecord): GenotypeMap {
  const defaults = buildDefaultGenotypes();
  const resolved: GenotypeMap = { ...defaults };

  for (const locusId of LOCI_ORDER) {
    const entry = loci[locusId];
    if (entry?.alleles && entry.confidence !== 'unknown') {
      resolved[locusId] = [...entry.alleles] as [string, string];
    }
  }

  return resolved;
}

export function alleleOptionsForLocus(locusId: string): string[] {
  return RABBIT_GENETIC_MAP[locusId]?.alleles.map((allele) => allele.code) ?? [];
}

export function averageConfidence(loci: LocusGenotypeRecord): AlleleConfidence {
  const values = LOCI_ORDER.map((id) => loci[id]?.confidence ?? 'unknown');
  if (values.every((v) => v === 'certain')) return 'certain';
  if (values.some((v) => v === 'unknown')) return 'guessed';
  if (values.some((v) => v === 'guessed')) return 'guessed';
  return 'likely';
}
