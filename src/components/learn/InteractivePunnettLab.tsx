import { useMemo, useState } from 'react';
import { LEARN_LOCUS_PRESETS, getLearnLocusPreset } from '../../data/learnLoci';
import {
  buildPunnettSquare,
  gameteDescription,
  parseDiploidGenotype,
  zygosityLabel,
} from '../../utils/punnettSquare';
import { formatProbability } from '../../utils/geneticEngine';
import { ProbabilityBar } from '../ProbabilityBar';
import { PunnettSquareGrid } from './PunnettSquareGrid';

type WalkthroughStep = 'parents' | 'gametes' | 'square' | 'ratios';

const WALKTHROUGH_STEPS: { id: WalkthroughStep; label: string }[] = [
  { id: 'parents', label: '1. Parents' },
  { id: 'gametes', label: '2. Gametes' },
  { id: 'square', label: '3. Square' },
  { id: 'ratios', label: '4. Ratios' },
];

export function InteractivePunnettLab() {
  const [locusId, setLocusId] = useState(LEARN_LOCUS_PRESETS[0].id);
  const [parent1Genotype, setParent1Genotype] = useState('Bb');
  const [parent2Genotype, setParent2Genotype] = useState('Bb');
  const [walkthroughStep, setWalkthroughStep] = useState<WalkthroughStep>('square');
  const [highlight, setHighlight] = useState<{ row: number; col: number } | null>(null);

  const preset = getLearnLocusPreset(locusId);

  const square = useMemo(
    () =>
      buildPunnettSquare(
        parseDiploidGenotype(parent1Genotype),
        parseDiploidGenotype(parent2Genotype),
        preset,
      ),
    [parent1Genotype, parent2Genotype, preset],
  );

  const parent1Alleles = parseDiploidGenotype(parent1Genotype);
  const parent2Alleles = parseDiploidGenotype(parent2Genotype);
  const maxOutcomeProbability = Math.max(...square.outcomes.map((o) => o.probability), 0);

  const resetForLocus = (nextLocusId: string) => {
    setLocusId(nextLocusId);
    setParent1Genotype('Bb');
    setParent2Genotype('Bb');
    setHighlight(null);
  };

  return (
    <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50">
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
          Interactive Punnett square lab
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Pick a trait, set two parents, and watch the square rebuild. Hover a cell to see which
          gametes combined.
        </p>
      </div>

      <div className="p-4 space-y-4">
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
          Trait to model
          <select
            value={locusId}
            onChange={(event) => resetForLocus(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-2 py-1.5 text-sm"
          >
            {LEARN_LOCUS_PRESETS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </label>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {preset.rabbitNote}
        </p>

        <div className="flex flex-wrap gap-2">
          {WALKTHROUGH_STEPS.map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setWalkthroughStep(step.id)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                walkthroughStep === step.id
                  ? 'bg-sky-100 dark:bg-sky-950/50 border-sky-400 dark:border-sky-600 text-sky-700 dark:text-sky-400 font-medium'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-sky-300'
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <ParentGenotypePicker
            label="Parent A"
            genotype={parent1Genotype}
            preset={preset}
            onChange={setParent1Genotype}
          />
          <ParentGenotypePicker
            label="Parent B"
            genotype={parent2Genotype}
            preset={preset}
            onChange={setParent2Genotype}
          />
        </div>

        {(walkthroughStep === 'parents' || walkthroughStep === 'gametes') && (
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <GameteCard
              parentLabel="Parent A"
              genotype={parent1Genotype}
              preset={preset}
              alleles={parent1Alleles}
              emphasized={walkthroughStep === 'gametes'}
            />
            <GameteCard
              parentLabel="Parent B"
              genotype={parent2Genotype}
              preset={preset}
              alleles={parent2Alleles}
              emphasized={walkthroughStep === 'gametes'}
            />
          </div>
        )}

        {walkthroughStep !== 'parents' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-950/30 flex flex-col items-center">
            <PunnettSquareGrid
              square={square}
              parent1Label="Parent A"
              parent2Label="Parent B"
              highlight={highlight}
              onHighlight={setHighlight}
            />
            {highlight && (
              <p className="text-xs text-sky-700 dark:text-sky-400 mt-3">
                Gamete {square.rowGametes[highlight.row]} from Parent A meets{' '}
                {square.colGametes[highlight.col]} from Parent B →{' '}
                <strong>{square.cells[highlight.row][highlight.col].label}</strong> (
                {square.cells[highlight.row][highlight.col].phenotype})
              </p>
            )}
          </div>
        )}

        {(walkthroughStep === 'square' || walkthroughStep === 'ratios') && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
                Genotype probabilities
              </h3>
              <ul className="space-y-2">
                {square.outcomes.map((outcome) => (
                  <li
                    key={outcome.label}
                    className="flex items-center justify-between gap-3 text-xs"
                  >
                    <span className="font-mono font-semibold">{outcome.label}</span>
                    <div className="flex items-center gap-2">
                      <ProbabilityBar value={outcome.probability} max={maxOutcomeProbability} />
                      <span className="font-mono tabular-nums w-12 text-right">
                        {formatProbability(outcome.probability)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
                Phenotype split
              </h3>
              <ul className="space-y-2">
                {square.phenotypeOutcomes.map((outcome) => (
                  <li key={outcome.phenotype} className="text-xs">
                    <div className="flex justify-between gap-2">
                      <span>{outcome.phenotype}</span>
                      <span className="font-mono tabular-nums">
                        {formatProbability(outcome.probability)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              {walkthroughStep === 'ratios' && (
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3">
                  Genotype ratio among offspring:{' '}
                  <strong className="font-mono">{square.ratioLabel}</strong>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

interface ParentGenotypePickerProps {
  label: string;
  genotype: string;
  preset: ReturnType<typeof getLearnLocusPreset>;
  onChange: (genotype: string) => void;
}

function ParentGenotypePicker({
  label,
  genotype,
  preset,
  onChange,
}: ParentGenotypePickerProps) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {preset.genotypes.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`px-3 py-1.5 rounded-md font-mono text-sm border transition ${
              genotype === option
                ? 'bg-sky-100 dark:bg-sky-950/50 border-sky-400 text-sky-800 dark:text-sky-300'
                : 'border-slate-200 dark:border-slate-700 hover:border-sky-300'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">
        {zygosityLabel(genotype, preset)} ·{' '}
        {parseDiploidGenotype(genotype)[0] === parseDiploidGenotype(genotype)[1]
          ? `both alleles ${parseDiploidGenotype(genotype)[0]}`
          : `one ${preset.dominantAllele}, one ${preset.recessiveAllele}`}
      </p>
    </div>
  );
}

interface GameteCardProps {
  parentLabel: string;
  genotype: string;
  preset: ReturnType<typeof getLearnLocusPreset>;
  alleles: [string, string];
  emphasized: boolean;
}

function GameteCard({ parentLabel, genotype, preset, alleles, emphasized }: GameteCardProps) {
  const gametes = alleles[0] === alleles[1] ? [alleles[0]] : [alleles[0], alleles[1]];

  return (
    <div
      className={`rounded-lg border p-3 ${
        emphasized
          ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50/60 dark:bg-indigo-950/20'
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
        {parentLabel} ({genotype})
      </p>
      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
        {gameteDescription(alleles, preset)}
      </p>
      {emphasized && (
        <div className="flex gap-2 mt-2">
          {gametes.map((gamete) => (
            <span
              key={gamete}
              className="inline-flex items-center justify-center h-8 min-w-8 px-2 rounded-full bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 font-mono font-bold text-indigo-700 dark:text-indigo-300"
            >
              {gamete}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
