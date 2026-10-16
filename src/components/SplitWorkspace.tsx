import { useMemo, useState } from 'react';
import { PARENT_PRESETS } from '../data/meatRabbitBreeds';
import { getPresetBreedingNotes } from '../data/presetBreedingNotes';
import { genotypesEqual, useGeneticStore } from '../store/useGeneticStore';
import { useSavedCrossesStore } from '../store/useSavedCrossesStore';
import { formatCompactGenotype } from '../utils/formatGenotype';
import { isBCDoubleHet, resolveParentPhenotype } from '../utils/geneticEngine';
import { furVars } from '../utils/furTone';
import {
  hiddenGenes,
  kitsPhrase,
  litterHeadline,
  litterLead,
  lookName,
  punnett,
  varyingLoci,
} from '../utils/litterCopy';
import { lookTitle, oddsPhrase, summarizeLitter, type LitterPhenotype } from '../utils/litterSummary';
import { resolvePlainEnglishPhenotype } from '../utils/plainEnglishPhenotype';
import { BCPhasePicker } from './BCPhasePicker';
import { ExampleCrossChips } from './ExampleCrossChips';
import { GenotypeInline } from './GenotypeInline';
import { ParentGenotypeEditor } from './ParentCrossPanel';
import { PresetPicker } from './PresetPicker';
import { PunnettSquare } from './PunnettSquare';
import { SavedCrossesPanel } from './SavedCrossesPanel';
import { WhyDisclosure } from './WhyDisclosure';

type ParentKey = 'parent1' | 'parent2';
type GenotypeMap = Record<string, [string, string]>;
const INITIAL_BLOCKS = 6;

function pct(p: number): string {
  return `${(p * 100).toFixed(1).replace(/\.0$/, '')}%`;
}

function presetLabel(id: string | null, genotype: GenotypeMap): string {
  const preset = id ? PARENT_PRESETS.find((p) => p.id === id) : null;
  if (!preset) return 'Custom rabbit';
  return genotypesEqual(genotype, preset.genotype) ? preset.label : `${preset.label} (edited)`;
}

function ParentPicker({ parentKey, role, mate }: { parentKey: ParentKey; role: 'doe' | 'buck'; mate: GenotypeMap }) {
  const genotype = useGeneticStore((s) => s[parentKey]);
  const presetId = useGeneticStore((s) => (parentKey === 'parent1' ? s.parent1PresetId : s.parent2PresetId));
  const loadParentPreset = useGeneticStore((s) => s.loadParentPreset);
  const clearParentPreset = useGeneticStore((s) => s.clearParentPreset);
  const resetParentToPreset = useGeneticStore((s) => s.resetParentToPreset);
  const look = useMemo(() => lookTitle(resolveParentPhenotype(genotype)), [genotype]);
  const hidden = useMemo(() => hiddenGenes(genotype), [genotype]);
  const notes = useMemo(() => getPresetBreedingNotes(presetId, genotype), [presetId, genotype]);
  const preset = presetId ? PARENT_PRESETS.find((p) => p.id === presetId) : null;
  const edited = Boolean(preset && !genotypesEqual(genotype, preset.genotype));

  const onPreset = (next: string | null) => {
    if (!next) return clearParentPreset(parentKey);
    const found = PARENT_PRESETS.find((p) => p.id === next);
    if (found) loadParentPreset(parentKey, found.id, found.genotype);
  };

  return (
    <section aria-label={`The ${role}`} className="mt-7">
      <p className="kicker text-ink-muted">The {role}</p>
      <div className="mt-2 flex items-start gap-4">
        <div className="fur-portrait h-24 w-24 shrink-0 sm:h-28 sm:w-28" style={furVars(genotype)} role="img" aria-label={look} />
        <div className="min-w-0 flex-1 space-y-2">
          <PresetPicker id={`${parentKey}-split-preset`} value={presetId} onChange={onPreset} />
          <p className="text-[15px] font-semibold leading-snug text-ink">
            {presetLabel(presetId, genotype)} · <span className="font-normal">{look}</span>
          </p>
          <p className="serif-note text-[15px] text-ink-soft">
            {hidden.length ? `Carries ${hidden.map((h) => h.replace(/ \(.*\)$/, '')).join(', ')}` : 'Carries no hidden genes we model'}
          </p>
        </div>
      </div>
      <BCPhasePicker parentKey={parentKey} role={role} />
      <WhyDisclosure label={`Why? See the ${role}'s genes`}>
        <GenotypeInline genotype={genotype} baseline={mate} />
        <p>{resolvePlainEnglishPhenotype(genotype)}</p>
        {hidden.length > 0 && <p>Hidden genes it can pass on: {hidden.join(', ')}.</p>}
        {notes.length > 0 && (
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        )}
        {edited && preset && (
          <button type="button" onClick={() => resetParentToPreset(parentKey, preset.genotype)} className="text-sm underline">
            Reset to {preset.label}
          </button>
        )}
        <details className="border border-rule bg-paper-2/50 p-3">
          <summary className="kicker cursor-pointer text-[11px] text-ink">Edit genes one by one</summary>
          <div className="pt-3">
            <ParentGenotypeEditor parentKey={parentKey} mateGenotype={mate} />
          </div>
        </details>
      </WhyDisclosure>
    </section>
  );
}

function OutcomeBlock({
  group,
  index,
  dam,
  sire,
  onLearnMore,
}: {
  group: LitterPhenotype;
  index: number;
  dam: GenotypeMap;
  sire: GenotypeMap;
  onLearnMore: () => void;
}) {
  const top = index === 0;
  const loci = varyingLoci(dam, sire);
  return (
    <article className={`flex flex-col border-b border-r border-rule p-5 sm:p-6 ${top ? 'bg-[var(--lichen)]' : 'bg-paper'}`}>
      <p className={`kicker ${top ? 'text-ink' : 'text-ink-muted'}`}>
        {String(index + 1).padStart(2, '0')} · {oddsPhrase(group.probability)}
        {oddsPhrase(group.probability) === 'Every kit' ? '' : ' kits'}
      </p>
      <div className="fur-portrait mb-4 mt-3 h-36" style={furVars(group.genotype)} role="img" aria-label={group.title} />
      <h3 className="headline text-[28px] sm:text-[30px]">{group.title}</h3>
      <p className="mt-1 text-[34px] font-bold tracking-[-0.04em] text-ink">{pct(group.probability)}</p>
      <p className="mt-1 text-[15px] leading-snug text-ink-soft">{group.plainEnglish}</p>
      <div className="mt-auto">
        <WhyDisclosure label="Why?">
          {loci.length > 0 ? (
            <>
              <p>
                Dark cells show the gene pairs behind this look&rsquo;s most likely genotype. In all, about{' '}
                {kitsPhrase(group.probability)} come out {lookName(group.title)}.
              </p>
              <div className="flex flex-col gap-4">
                {loci.map((id) => (
                  <PunnettSquare key={id} grid={punnett(id, dam, sire)} highlight={group.genotype[id]} />
                ))}
              </div>
            </>
          ) : (
            <p>Both parents carry matching pairs at every gene, so every kit gets the same genes.</p>
          )}
          <p className="font-mono text-[12px] text-ink">
            Most likely genotype: {formatCompactGenotype(group.genotype)}
            <br />
            {group.variantCount === 1 ? 'One genotype gives this look.' : `${group.variantCount} genotype mixes give this look.`}
          </p>
          <button type="button" onClick={onLearnMore} className="kicker text-[11px] text-ink underline">
            Learn more →
          </button>
        </WhyDisclosure>
      </div>
    </article>
  );
}

interface SplitWorkspaceProps {
  onLearnMore: () => void;
}

/** Option 2, Split hero workspace: parents on the paper half, the answer on the ink half, then outcome blocks. */
export function SplitWorkspace({ onLearnMore }: SplitWorkspaceProps) {
  const dam = useGeneticStore((s) => s.parent1);
  const sire = useGeneticStore((s) => s.parent2);
  const swapParents = useGeneticStore((s) => s.swapParents);
  const getCrossSnapshot = useGeneticStore((s) => s.getCrossSnapshot);
  const damPreset = useGeneticStore((s) => s.parent1PresetId);
  const sirePreset = useGeneticStore((s) => s.parent2PresetId);
  const saveCross = useSavedCrossesStore((s) => s.saveCross);
  const [saved, setSaved] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const bcPhase = useGeneticStore((s) => s.bcPhase);
  const groups = useMemo(() => summarizeLitter(dam, sire, { phase: bcPhase }), [dam, sire, bcPhase]);
  const linkageParents: { role: string; phase: string }[] = [
    isBCDoubleHet(dam) ? { role: 'doe', phase: bcPhase.parent1 } : null,
    isBCDoubleHet(sire) ? { role: 'buck', phase: bcPhase.parent2 } : null,
  ].filter((x) => x !== null) as { role: string; phase: string }[];
  const headline = litterHeadline(groups);
  const lead = litterLead(groups);
  const top = groups[0];
  const visible = showAll ? groups : groups.slice(0, INITIAL_BLOCKS);
  const nextLooks = groups.slice(1, 5).map((g) => lookName(g.title));

  const onSave = () => {
    saveCross(`${presetLabel(damPreset, dam)} × ${presetLabel(sirePreset, sire)}`, getCrossSnapshot());
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <section className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-2">
        <div className="bg-paper px-4 pb-10 pt-8 sm:px-9 lg:pt-12">
          <p className="kicker text-ink-muted">Plan a litter</p>
          <h1 className="headline mt-2 text-[clamp(3.5rem,8vw,7.5rem)] text-ink">Doe × buck</h1>
          <p className="mt-5 max-w-[34rem] text-xl leading-snug text-ink sm:text-2xl">
            Pick two parents. The answer updates the moment you change either one.
          </p>
          <div className="mt-6">
            <ExampleCrossChips />
          </div>
          <ParentPicker parentKey="parent1" role="doe" mate={sire} />
          <ParentPicker parentKey="parent2" role="buck" mate={dam} />
          <div className="mt-8 grid grid-cols-1 gap-3 sm:flex">
            <button type="button" onClick={onSave} className="btn-block btn-forest whitespace-nowrap">
              {saved ? 'Saved on this device ✓' : 'Save this cross'}
            </button>
            <button type="button" onClick={swapParents} className="btn-block btn-outline whitespace-nowrap text-ink">
              Swap doe and buck
            </button>
          </div>
        </div>

        <div className="relative order-first min-h-[440px] bg-[var(--moss)] lg:order-none lg:min-h-0">
          {top && (
            <>
              <div
                className="fur-portrait absolute inset-x-6 top-6 h-[250px] sm:inset-x-[12%] sm:top-12 lg:h-[440px]"
                style={furVars(top.genotype)}
                role="img"
                aria-label={top.title}
              />
              <div className="absolute inset-x-4 top-[200px] border border-ink bg-paper p-5 sm:left-auto sm:right-[8%] sm:top-[380px] sm:w-[26rem]">
                <p className="kicker text-ink-muted">The answer · most likely kit</p>
                <p className="headline mt-1 text-[clamp(2rem,3.4vw,2.9rem)] text-ink">{top.title}</p>
                <p className="mt-1 text-xl font-bold text-ink">
                  {oddsPhrase(top.probability)}
                  {oddsPhrase(top.probability) === 'Every kit' ? '' : ' kits'} · {pct(top.probability)}
                </p>
                {nextLooks.length > 0 && (
                  <p className="serif-note mt-1 text-ink-soft">Then {nextLooks.join(', ')}.</p>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] border-t border-rule bg-paper px-4 pb-6 pt-10 sm:px-9" aria-labelledby="litter-title">
        <p className="kicker text-ink-muted">Your litter, in plain English</p>
        <h2 id="litter-title" className="headline mt-2 text-[clamp(2.5rem,5vw,4.5rem)] text-ink">
          {headline}
        </h2>
        <p className="mt-4 max-w-[46rem] text-lg leading-snug text-ink sm:text-xl">{lead}</p>
        {linkageParents.length > 0 && (
          <div className="max-w-[46rem]">
            <WhyDisclosure
              label={
                linkageParents.some((p) => p.phase === 'unknown')
                  ? 'Why? B and C linkage is set to not known'
                  : 'Why? These odds include B and C linkage'
              }
            >
              {linkageParents.map((p) => (
                <p key={p.role}>
                  The {p.role} is mixed at both B and C, which sit on the same chromosome.{' '}
                  {p.phase === 'unknown'
                    ? `We don't know which B came in with which C, so we use plain Punnett odds for the ${p.role}. That is the average of the two possibilities. If you know the pairing, set it under the ${p.role}.`
                    : `You set which B and C came in together, so the ${p.role}'s eggs or sperm keep that pairing 64% of the time and swap it 36% (Castle 1924).`}
                </p>
              ))}
              <button type="button" onClick={onLearnMore} className="kicker text-[11px] text-ink underline">
                How linkage works →
              </button>
            </WhyDisclosure>
          </div>
        )}
      </section>

      <section
        aria-label={`${groups.length} looks in this litter`}
        className="mx-auto grid max-w-[1440px] grid-cols-1 border-l border-t border-rule sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(240px,1fr))]"
      >
        {visible.map((g, i) => (
          <OutcomeBlock key={g.title} group={g} index={i} dam={dam} sire={sire} onLearnMore={onLearnMore} />
        ))}
      </section>

      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 bg-paper px-4 py-8 sm:flex-row sm:px-9">
        {groups.length > INITIAL_BLOCKS && (
          <button type="button" onClick={() => setShowAll((v) => !v)} className="btn-block btn-outline text-ink">
            {showAll ? 'Show fewer looks' : `Show ${groups.length - INITIAL_BLOCKS} more looks`}
          </button>
        )}
        <button type="button" onClick={onLearnMore} className="btn-block btn-forest">
          Learn more about this litter
        </button>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 pb-8 sm:px-9">
        <SavedCrossesPanel />
      </div>
    </div>
  );
}
