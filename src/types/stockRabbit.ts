type GenotypeMap = Record<string, [string, string]>;

export type RabbitSex = 'buck' | 'doe';

export type AlleleConfidence = 'certain' | 'likely' | 'guessed' | 'unknown';

export interface LocusRecord {
  alleles: [string, string] | null;
  confidence: AlleleConfidence;
}

export type LocusGenotypeRecord = Record<string, LocusRecord>;

export interface StockRabbit {
  id: string;
  accountId: string;
  name: string;
  sex: RabbitSex;
  dateOfBirth: string | null;
  earTag: string | null;
  notes: string;
  sourcePresetId: string | null;
  loci: LocusGenotypeRecord;
  resolvedGenotype: GenotypeMap;
  createdAt: number;
  updatedAt: number;
}

export interface StockRabbitDraft {
  name: string;
  sex: RabbitSex;
  dateOfBirth: string;
  earTag: string;
  notes: string;
  sourcePresetId: string | null;
  loci: LocusGenotypeRecord;
}

export const CONFIDENCE_LABELS: Record<AlleleConfidence, string> = {
  certain: 'Certain',
  likely: 'Likely',
  guessed: 'Best guess',
  unknown: 'Unknown',
};
