import { useMemo, useState } from 'react';
import { PARENT_PRESETS } from '../../data/meatRabbitBreeds';
import { LOCI_ORDER, RABBIT_GENETIC_MAP } from '../../data/rabbitGenetics';
import {
  CONFIDENCE_LABELS,
  type AlleleConfidence,
  type RabbitSex,
  type StockRabbitDraft,
} from '../../types/stockRabbit';
import {
  alleleOptionsForLocus,
  buildEmptyLocusRecord,
  lociFromPreset,
  resolveGenotypeFromLoci,
} from '../../utils/stockGenotype';
import { PhenotypeRenderer } from '../PhenotypeRenderer';
import { resolveParentPhenotype } from '../../utils/geneticEngine';

const STEPS = ['Identity', 'Starting point', 'Alleles', 'Review'] as const;
type Step = (typeof STEPS)[number];

interface AddStockRabbitWizardProps {
  onCancel: () => void;
  onSave: (draft: StockRabbitDraft) => void;
}

export function AddStockRabbitWizard({ onCancel, onSave }: AddStockRabbitWizardProps) {
  const [step, setStep] = useState<Step>('Identity');
  const [name, setName] = useState('');
  const [sex, setSex] = useState<RabbitSex>('doe');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [earTag, setEarTag] = useState('');
  const [notes, setNotes] = useState('');
  const [sourcePresetId, setSourcePresetId] = useState<string | null>(null);
  const [loci, setLoci] = useState(buildEmptyLocusRecord);

  const stepIndex = STEPS.indexOf(step);
  const resolvedGenotype = useMemo(() => resolveGenotypeFromLoci(loci), [loci]);
  const phenotype = useMemo(() => resolveParentPhenotype(resolvedGenotype), [resolvedGenotype]);

  const applyPreset = (presetId: string | null) => {
    setSourcePresetId(presetId);
    setLoci(presetId ? lociFromPreset(presetId) : buildEmptyLocusRecord());
  };

  const updateLocus = (
    locusId: string,
    patch: Partial<{ alleles: [string, string] | null; confidence: AlleleConfidence }>,
  ) => {
    setLoci((current) => ({
      ...current,
      [locusId]: { ...current[locusId], ...patch },
    }));
  };

  const canAdvance = () => {
    if (step === 'Identity') return name.trim().length > 0;
    return true;
  };

  const goNext = () => {
    const next = STEPS[stepIndex + 1];
    if (next) setStep(next);
  };

  const goBack = () => {
    const prev = STEPS[stepIndex - 1];
    if (prev) setStep(prev);
  };

  const handleSave = () => {
    onSave({
      name,
      sex,
      dateOfBirth,
      earTag,
      notes,
      sourcePresetId,
      loci,
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50">
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
          Add to stock roster
        </h2>
        <div className="flex gap-2 mt-2">
          {STEPS.map((label, index) => (
            <span
              key={label}
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                index === stepIndex
                  ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 font-semibold'
                  : index < stepIndex
                    ? 'text-slate-500 dark:text-slate-400'
                    : 'text-slate-400 dark:text-slate-600'
              }`}
            >
              {index + 1}. {label}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {step === 'Identity' && (
          <div className="space-y-3">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Willow"
                className="mt-1 w-full text-sm rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 py-2"
              />
            </label>
            <fieldset>
              <legend className="text-xs font-medium text-slate-600 dark:text-slate-300">Sex</legend>
              <div className="flex gap-2 mt-1">
                {(['doe', 'buck'] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSex(option)}
                    className={`text-xs px-3 py-1.5 rounded-md border capitalize ${
                      sex === option
                        ? 'bg-sky-100 dark:bg-sky-950/60 border-sky-400 text-sky-800'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
                Date of birth
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="mt-1 w-full text-sm rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 py-2"
                />
              </label>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
                Ear tag / ID
                <input
                  value={earTag}
                  onChange={(e) => setEarTag(e.target.value)}
                  placeholder="Optional"
                  className="mt-1 w-full text-sm rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 py-2"
                />
              </label>
            </div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              Notes
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Line, sire/dam, show notes…"
                className="mt-1 w-full text-sm rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 py-2"
              />
            </label>
          </div>
        )}

        {step === 'Starting point' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pick a breed preset to pre-fill likely alleles, or start blank and set everything
              manually.
            </p>
            <select
              value={sourcePresetId ?? ''}
              onChange={(e) => applyPreset(e.target.value || null)}
              className="w-full text-sm rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 py-2"
            >
              <option value="">Custom — set alleles manually</option>
              {PARENT_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {step === 'Alleles' && (
          <div className="space-y-2 max-h-[min(50vh,360px)] overflow-y-auto pr-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 sticky top-0 bg-white dark:bg-slate-900 pb-2">
              Set each locus and how confident you are. Use Unknown when you genuinely don&apos;t
              know — we&apos;ll fall back to defaults for predictions.
            </p>
            {LOCI_ORDER.map((locusId) => {
              const locus = RABBIT_GENETIC_MAP[locusId];
              const record = loci[locusId];
              const options = alleleOptionsForLocus(locusId);

              return (
                <div
                  key={locusId}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 p-2.5 space-y-2"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {locusId} — {locus?.name}
                    </span>
                    <select
                      value={record.confidence}
                      onChange={(e) =>
                        updateLocus(locusId, {
                          confidence: e.target.value as AlleleConfidence,
                        })
                      }
                      className="text-[10px] rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-1.5 py-1"
                    >
                      {(Object.keys(CONFIDENCE_LABELS) as AlleleConfidence[]).map((key) => (
                        <option key={key} value={key}>
                          {CONFIDENCE_LABELS[key]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={record.alleles?.[0] ?? ''}
                      disabled={record.confidence === 'unknown'}
                      onChange={(e) => {
                        const a = e.target.value;
                        const b = record.alleles?.[1] ?? a;
                        updateLocus(locusId, { alleles: [a, b] });
                      }}
                      className="flex-1 text-xs font-mono rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-2 py-1.5"
                    >
                      {options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <select
                      value={record.alleles?.[1] ?? ''}
                      disabled={record.confidence === 'unknown'}
                      onChange={(e) => {
                        const b = e.target.value;
                        const a = record.alleles?.[0] ?? b;
                        updateLocus(locusId, { alleles: [a, b] });
                      }}
                      className="flex-1 text-xs font-mono rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-2 py-1.5"
                    >
                      {options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {step === 'Review' && (
          <div className="flex gap-4">
            <PhenotypeRenderer genotype={resolvedGenotype} size="md" className="shrink-0" />
            <div className="text-sm space-y-1 min-w-0">
              <p className="font-semibold text-slate-800 dark:text-slate-100">
                {name}{' '}
                <span className="text-slate-400 font-normal capitalize">({sex})</span>
              </p>
              {earTag && (
                <p className="text-xs text-slate-500">ID: {earTag}</p>
              )}
              {dateOfBirth && (
                <p className="text-xs text-slate-500">Born: {dateOfBirth}</p>
              )}
              <p className="text-xs text-slate-600 dark:text-slate-300">{phenotype}</p>
            </div>
          </div>
        )}

        <div className="flex justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={stepIndex === 0 ? onCancel : goBack}
            className="text-xs text-slate-500 hover:underline"
          >
            {stepIndex === 0 ? 'Cancel' : 'Back'}
          </button>
          {step === 'Review' ? (
            <button
              type="button"
              onClick={handleSave}
              className="text-sm font-medium rounded-md bg-sky-600 hover:bg-sky-700 text-white px-4 py-2"
            >
              Save to roster
            </button>
          ) : (
            <button
              type="button"
              disabled={!canAdvance()}
              onClick={goNext}
              className="text-sm font-medium rounded-md bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white px-4 py-2"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
