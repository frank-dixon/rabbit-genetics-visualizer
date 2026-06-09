import { useMemo, useState } from 'react';
import { getLearnLocusPreset } from '../../data/learnLoci';
import { buildPunnettSquare, parseDiploidGenotype } from '../../utils/punnettSquare';
import { formatProbability } from '../../utils/geneticEngine';
import { GenotypeButtonPicker } from './GenotypeButtonPicker';
import { PunnettSquareGrid } from './PunnettSquareGrid';

export function IndependentAssortmentDemo() {
  const bPreset = getLearnLocusPreset('B');
  const dPreset = getLearnLocusPreset('D');

  const [parentB1, setParentB1] = useState('Bb');
  const [parentB2, setParentB2] = useState('Bb');
  const [parentD1, setParentD1] = useState('Dd');
  const [parentD2, setParentD2] = useState('Dd');

  const bSquare = useMemo(
    () =>
      buildPunnettSquare(
        parseDiploidGenotype(parentB1),
        parseDiploidGenotype(parentB2),
        bPreset,
      ),
    [parentB1, parentB2, bPreset],
  );

  const dSquare = useMemo(
    () =>
      buildPunnettSquare(
        parseDiploidGenotype(parentD1),
        parseDiploidGenotype(parentD2),
        dPreset,
      ),
    [parentD1, parentD2, dPreset],
  );

  const exampleB = bSquare.outcomes.find((o) => o.label === 'Bb') ?? bSquare.outcomes[0];
  const exampleD = dSquare.outcomes.find((o) => o.label === 'Dd') ?? dSquare.outcomes[0];
  const jointProbability = exampleB.probability * exampleD.probability;

  return (
    <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 text-center">
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
          Independent assortment (two loci)
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-lg mx-auto">
          Mendel&apos;s second law — alleles at different loci sort independently. Multiply each
          locus probability to get the joint chance.
        </p>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <MiniLocusPanel
            title="B locus"
            subtitle="Black vs chocolate"
            preset={bPreset}
            parent1={parentB1}
            parent2={parentB2}
            onParent1Change={setParentB1}
            onParent2Change={setParentB2}
            square={bSquare}
          />
          <MiniLocusPanel
            title="D locus"
            subtitle="Dense vs dilute"
            preset={dPreset}
            parent1={parentD1}
            parent2={parentD2}
            onParent1Change={setParentD1}
            onParent2Change={setParentD2}
            square={dSquare}
          />
        </div>

        <div className="rounded-xl border border-sky-200/80 dark:border-sky-800/80 bg-gradient-to-br from-sky-50/80 to-indigo-50/40 dark:from-sky-950/30 dark:to-indigo-950/20 p-4">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-3 text-center">
            Joint probability example
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-sm">
            <OutcomeChip locus="B" genotype={exampleB.label} probability={exampleB.probability} />
            <span className="text-slate-400 dark:text-slate-500 font-light text-lg">×</span>
            <OutcomeChip locus="D" genotype={exampleD.label} probability={exampleD.probability} />
            <span className="text-slate-400 dark:text-slate-500 font-light text-lg">=</span>
            <div className="rounded-lg bg-white/80 dark:bg-slate-900/80 border border-sky-300 dark:border-sky-700 px-4 py-2 text-center">
              <span className="font-mono font-bold text-lg text-sky-700 dark:text-sky-300 tabular-nums">
                {formatProbability(jointProbability)}
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {exampleB.label} at B · {exampleD.label} at D
              </p>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 text-center leading-relaxed">
            The full predictor multiplies every modeled locus (A, B, C, D, E, En, V, Si) this way,
            then applies rabbit epistasis rules for coat color.
          </p>
        </div>
      </div>
    </section>
  );
}

function OutcomeChip({
  locus,
  genotype,
  probability,
}: {
  locus: string;
  genotype: string;
  probability: number;
}) {
  return (
    <div className="rounded-lg bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 px-3 py-2 text-center min-w-[5rem]">
      <p className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {locus} locus
      </p>
      <p className="font-mono font-bold text-slate-800 dark:text-slate-100">{genotype}</p>
      <p className="text-[10px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
        {formatProbability(probability)}
      </p>
    </div>
  );
}

interface MiniLocusPanelProps {
  title: string;
  subtitle: string;
  preset: ReturnType<typeof getLearnLocusPreset>;
  parent1: string;
  parent2: string;
  onParent1Change: (value: string) => void;
  onParent2Change: (value: string) => void;
  square: ReturnType<typeof buildPunnettSquare>;
}

function MiniLocusPanel({
  title,
  subtitle,
  preset,
  parent1,
  parent2,
  onParent1Change,
  onParent2Change,
  square,
}: MiniLocusPanelProps) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 p-4 flex flex-col items-center gap-4 text-center">
      <div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <GenotypeButtonPicker
          label="P1"
          value={parent1}
          options={preset.genotypes}
          onChange={onParent1Change}
        />
        <GenotypeButtonPicker
          label="P2"
          value={parent2}
          options={preset.genotypes}
          onChange={onParent2Change}
        />
      </div>

      <PunnettSquareGrid square={square} parent1Label="P1" parent2Label="P2" />
    </div>
  );
}
