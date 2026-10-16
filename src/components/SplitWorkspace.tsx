import { useCallback, useMemo, useState } from 'react';
import { PARENT_PRESETS } from '../data/meatRabbitBreeds';
import { getPresetBreedingNotes } from '../data/presetBreedingNotes';
import { genotypesEqual, useGeneticStore } from '../store/useGeneticStore';
import { useSavedCrossesStore } from '../store/useSavedCrossesStore';
import { formatCompactGenotype } from '../utils/formatGenotype';
import { isBCDoubleHet, resolveParentPhenotype } from '../utils/geneticEngine';
import { CoatTile } from './CoatTile';
import { HairBar } from './HairBar';
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
import { ParentGenesModal } from './ParentGenesModal';

type ParentKey = 'parent1' | 'parent2';
type GenotypeMap = Record<string, [string, string]>;
const INITIAL_BLOCKS = 6;
const OTHERS_SHOWN = 6;

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
  const [genesOpen, setGenesOpen] = useState(false);
  const closeGenes = useCallback(() => setGenesOpen(false), []);

  const onPreset = (next: string | null) => {
    if (!next) return clearParentPreset(parentKey);
    const found = PARENT_PRESETS.find((p) => p.id === next);
    if (found) loadParentPreset(parentKey, found.id, found.genotype);
  };

  return (
    <section
      aria-label={`The ${role}`}
      className="flex h-full min-w-0 flex-col border-2 border-ink bg-paper p-4 transition-shadow focus-within:shadow-[6px_6px_0_var(--ink)] hover:shadow-[6px_6px_0_var(--ink)]"
    >
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="kicker text-[11px] text-ink">The {role}</h2>
        {edited && <span className="kicker text-[10px] text-ink-muted">Edited</span>}
      </div>
      <div className="mt-2">
        <PresetPicker
          id={`${parentKey}-split-preset`}
          value={presetId}
          onChange={onPreset}
          variant="hero"
          prompt={`Choose a ${role}`}
        />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <CoatTile genotype={genotype} name={look} size="sm" className="h-14 w-14 shrink-0 rounded-[6px] border border-ink/20" />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold leading-snug text-ink">{look}</p>
          <p className="text-[13px] leading-snug text-ink-soft">
            {hidden.length ? `Carries ${hidden.map((h) => h.replace(/ \(.*\)$/, '')).join(', ')}` : 'No hidden genes we model'}
          </p>
          <HairBar genotype={genotype} className="mt-1.5 max-w-[11rem]" />
        </div>
      </div>
      <BCPhasePicker parentKey={parentKey} role={role} />
      <div className="mt-auto pt-3">
        <p className="truncate font-mono text-[12px] text-ink-muted" title={formatCompactGenotype(genotype)}>
          {formatCompactGenotype(genotype)}
        </p>
        <button
          type="button"
          onClick={() => setGenesOpen(true)}
          aria-haspopup="dialog"
          className="kicker mt-1 text-[11px] text-ink underline underline-offset-4"
        >
          See or edit the {role}&rsquo;s genes →
        </button>
      </div>
      <ParentGenesModal
        open={genesOpen}
        onClose={closeGenes}
        titleId={`${parentKey}-genes-title`}
        kicker={`The ${role} · genes`}
        title={look}
        genotype={genotype}
      >
        <GenotypeInline genotype={genotype} baseline={mate} />
        <p className="text-ink">{resolvePlainEnglishPhenotype(genotype)}</p>
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
        <section aria-labelledby={`${parentKey}-edit-heading`} className="border border-rule bg-paper-2/50 p-3">
          <h3 id={`${parentKey}-edit-heading`} className="kicker text-[11px] text-ink">
            Edit genes one by one
          </h3>
          <p className="mt-1 text-[13px]">Changes apply to the cross right away.</p>
          <div className="pt-3">
            <ParentGenotypeEditor parentKey={parentKey} mateGenotype={mate} />
          </div>
        </section>
      </ParentGenesModal>
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
      <CoatTile genotype={group.genotype} name={group.title} size="md" className="mb-2 mt-3 h-36" />
      <HairBar genotype={group.genotype} labeled className="mb-4" />
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
  const others = groups.slice(1);

  const onSave = () => {
    saveCross(`${presetLabel(damPreset, dam)} × ${presetLabel(sirePreset, sire)}`, getCrossSnapshot());
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <section className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="bg-paper px-4 pb-7 pt-6 sm:px-9 lg:pt-8">
          <p className="kicker text-ink-muted">Plan a litter</p>
          <h1 className="headline mt-1 text-[clamp(2.25rem,4.2vw,3.75rem)] text-ink">Doe × buck</h1>
          <p className="mt-2 max-w-[38rem] text-[17px] leading-snug text-ink-soft">
            Choose a parent on each side. The odds update as soon as you change either one.
          </p>
          <div className="mt-5 grid grid-cols-1 items-stretch gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
            <ParentPicker parentKey="parent1" role="doe" mate={sire} />
            <span aria-hidden className="headline self-center justify-self-center text-[28px] leading-none text-ink-muted">
              ×
            </span>
            <ParentPicker parentKey="parent2" role="buck" mate={dam} />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button type="button" onClick={onSave} className="btn-block btn-forest whitespace-nowrap">
              {saved ? 'Saved on this device ✓' : 'Save this cross'}
            </button>
            <button type="button" onClick={swapParents} className="btn-block btn-outline whitespace-nowrap text-ink">
              Swap doe and buck
            </button>
          </div>
          <div className="mt-5">
            <ExampleCrossChips />
          </div>
        </div>

        <div className="order-first bg-[var(--moss)] px-4 py-5 sm:px-9 lg:order-none lg:py-8">
          {top && (
            <div className="mx-auto max-w-[30rem] border border-ink bg-paper">
              <CoatTile genotype={top.genotype} name={top.title} size="lg" className="h-[150px] sm:h-[190px]" />
              <div className="p-5">
                <p className="kicker text-ink-muted">Most likely kit</p>
                <p className="headline mt-1 text-[clamp(1.6rem,2.6vw,2.25rem)] text-ink">{top.title}</p>
                <HairBar genotype={top.genotype} labeled className="mt-3 max-w-[22rem]" />
                <p className="mt-2 text-lg font-bold text-ink">
                  {oddsPhrase(top.probability)}
                  {oddsPhrase(top.probability) === 'Every kit' ? '' : ' kits'} · {pct(top.probability)}
                </p>
                {others.length > 0 && (
                  <div className="mt-4 border-t border-rule pt-3">
                    <p className="kicker text-[10px] text-ink-muted">Also in this litter</p>
                    <ul className="mt-2 space-y-1.5">
                      {others.slice(0, OTHERS_SHOWN).map((g) => (
                        <li key={g.title} className="flex items-center gap-3 text-[14px] text-ink">
                          <CoatTile genotype={g.genotype} name={g.title} size="sm" className="h-8 w-8 shrink-0 rounded-[4px]" />
                          <span className="min-w-0 flex-1 truncate" title={g.title}>{g.title}</span>
                          <HairBar genotype={g.genotype} className="w-10 shrink-0 sm:w-16" />
                          <span className="font-mono text-[13px] font-bold tabular-nums">{pct(g.probability)}</span>
                        </li>
                      ))}
                    </ul>
                    {others.length > OTHERS_SHOWN && (
                      <p className="mt-2 text-[13px] text-ink-soft">
                        +{others.length - OTHERS_SHOWN} rarer looks below, {pct(others.slice(OTHERS_SHOWN).reduce((s, g) => s + g.probability, 0))} combined
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
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
