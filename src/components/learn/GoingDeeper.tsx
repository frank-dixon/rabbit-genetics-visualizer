import { useMemo, useState } from 'react';
import { RABBIT_GENETIC_MAP, buildDefaultGenotypes } from '../../data/rabbitGenetics';
import { useGeneticStore } from '../../store/useGeneticStore';
import { BC_RECOMBINATION, bcGametes, calculateCross, isBCDoubleHet, type BCPhase } from '../../utils/geneticEngine';
import { orderPair } from '../../utils/litterCopy';
import { summarizeLitter } from '../../utils/litterSummary';
import { phaseLabel } from '../BCPhasePicker';
import { Bar, Callout, DOE, DOE2, Lab, SourceNote, Stepper, Unc, fmtPct } from './storyParts';

type G = Record<string, [string, string]>;
const R = BC_RECOMBINATION;
const FIVE = ['A', 'B', 'C', 'D', 'E'];
const ALL = ['A', 'B', 'C', 'D', 'E', 'En', 'V', 'Si'];
/** The other loci fixed (en en, V V, Si Si) so the engine can name each kit's look. */
const rest = (g: G): G => ({ ...buildDefaultGenotypes(), ...g });

const EX_DOE: G = rest({ A: ['A', 'A'], B: ['B', 'b'], C: ['C', 'C'], D: ['d', 'd'], E: ['E', 'E'] });
const EX_BUCK: G = rest({ A: ['A', 'a'], B: ['b', 'b'], C: ['c', 'c'], D: ['d', 'd'], E: ['e', 'e'] });
const HET_DOE: G = rest({ A: ['A', 'a'], B: ['B', 'b'], C: ['C', 'c'], D: ['D', 'd'], E: ['E', 'e'] });
const REC_BUCK: G = rest({ A: ['a', 'a'], B: ['b', 'b'], C: ['c', 'c'], D: ['d', 'd'], E: ['e', 'e'] });

const TITLES = [
  'Your cross, one gene at a time',
  'Different chromosomes: a fresh coin toss for each',
  'Same chromosome: distance sets the odds',
  'Five genes, one linked pair',
];

const mixed = (p: [string, string]) => p[0] !== p[1];
const pairStr = (id: string, p: [string, string]) => orderPair(id, p[0], p[1]).join('');
const compact = (g: G, loci: string[]) => loci.map((id) => pairStr(id, g[id])).join(' ');

function kitsGet(id: string, d: [string, string], s: [string, string]): string {
  const counts = new Map<string, number>();
  for (const a of d) for (const b of s) {
    const k = orderPair(id, a, b).join('');
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  if (counts.size === 1) return `${[...counts.keys()][0]}, always`;
  const frac = (n: number) => ({ 1: '¼', 2: '½', 3: '¾' })[n] ?? String(n);
  return [...counts.entries()].map(([k, n]) => `${k} ${frac(n)}`).join(' · ');
}

function Step1({ dam, sire, phase, useExample }: { dam: G; sire: G; phase: Record<'parent1' | 'parent2', BCPhase>; useExample: boolean }) {
  const d = useExample ? EX_DOE : dam;
  const s = useExample ? EX_BUCK : sire;
  const loci = useExample ? FIVE : ALL.filter((id) => d[id] && s[id]);
  const outcomes = useMemo(
    () => calculateCross(d, s, useExample ? {} : { phase }),
    [d, s, phase, useExample],
  );
  const varying = loci.filter((id) => mixed(d[id]) || mixed(s[id]));
  const shown = outcomes.slice(0, 8);
  const max = Math.max(...shown.map((o) => o.probability * 100), 1);
  const linkedParent = isBCDoubleHet(d) ? 'doe' : isBCDoubleHet(s) ? 'buck' : null;
  return (
    <>
      <Lab>What each parent can pass on</Lab>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[14px]">
          <thead>
            <tr className="kicker border-b border-rule text-left text-[10.5px] text-ink-muted">
              <th className="py-1.5 font-normal">Gene</th>
              <th className="py-1.5 font-normal">Doe</th>
              <th className="py-1.5 font-normal">Buck</th>
              <th className="py-1.5 font-normal">Kits get</th>
            </tr>
          </thead>
          <tbody>
            {loci.map((id) => (
              <tr key={id} className="border-b border-rule">
                <td className="py-1.5">
                  <b>{id}</b> <span className="text-ink-soft">{RABBIT_GENETIC_MAP[id]?.name.toLowerCase()}</span>
                </td>
                <td className="py-1.5 font-mono">
                  {pairStr(id, d[id])}
                  {mixed(d[id]) && <span className="text-ink-muted"> · mixed</span>}
                </td>
                <td className="py-1.5 font-mono">
                  {pairStr(id, s[id])}
                  {mixed(s[id]) && <span className="text-ink-muted"> · mixed</span>}
                </td>
                <td className="py-1.5 font-mono text-[13px]">{kitsGet(id, d[id], s[id])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Lab>
        Kits from this cross · {outcomes.length} genotype{outcomes.length === 1 ? '' : 's'}
        {outcomes.length > shown.length ? `, top ${shown.length} shown` : ''}
      </Lab>
      {shown.map((o) => (
        <Bar key={o.genotype} k={varying.length ? compact(o.genotypeByLocus, varying) : 'every kit'} v={o.probability * 100} max={max} />
      ))}
      <Callout>
        {linkedParent ? (
          <>
            Your {linkedParent} is mixed at both B and C, which share chromosome 1, so linkage can change these odds.
            Step 4 shows how much.
          </>
        ) : (
          <>
            B and C sit on the same chromosome, but linkage can&rsquo;t change these odds. Neither parent is mixed at
            both B and C, so a crossover between them swaps identical copies. To see linkage, a parent has to be mixed
            at two genes on the same chromosome. The next steps use the doe <b className="font-mono">Aa Bb Cc Dd Ee</b>.
          </>
        )}
      </Callout>
      <SourceNote>Computed exactly by the app&rsquo;s engine, enumerating every egg and sperm type.</SourceNote>
    </>
  );
}

function Pair({ name, chr, top, bot, flip }: { name: string; chr: React.ReactNode; top: string; bot: string; flip?: boolean }) {
  const strip = (bg: string, t: string) => (
    <div className="relative my-1.5 h-5 rounded-full border border-ink" style={{ background: bg }}>
      <span className="absolute inset-y-[-1px] left-1/2 -translate-x-1/2 border-x border-ink bg-[#F5D76E] px-1.5 font-mono text-[12px] leading-[18px]">
        {t}
      </span>
    </div>
  );
  return (
    <div className="border border-rule p-2.5 text-center">
      <p className="font-mono text-[12px]">{name}</p>
      <p className="font-mono text-[11px] text-ink-muted">{chr}</p>
      {strip(flip ? DOE2 : DOE, flip ? bot : top)}
      {strip(flip ? DOE : DOE2, flip ? top : bot)}
    </div>
  );
}

function Step2() {
  return (
    <>
      <Lab>One cell, first division of meiosis · each pair&rsquo;s orientation is random</Lab>
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        <Pair name="A pair" chr="OCU4" top="A" bot="a" />
        <Pair name="B + C pair" chr="OCU1" top="B C" bot="b c" flip />
        <Pair name="D pair" chr={<Unc>UNCERTAIN</Unc>} top="D" bot="d" flip />
        <Pair name="E pair" chr={<Unc>UNKNOWN</Unc>} top="E" bot="e" />
      </div>
      <p className="mt-3 text-[14.5px]">
        The top copy of each pair goes to the egg. Darker shade = the copy she got from her sire. This cell gives an
        egg of <b className="font-mono">A b c d E</b>; another cell can flip any pair.
      </p>
      <Lab>Egg types from <span className="normal-case tracking-normal">Aa Bb Cc Dd Ee</span>, if all five were independent</Lab>
      <Bar k="each of 32 types" v={3.125} max={10} />
      <SourceNote>
        D (MLPH) is on an unplaced scaffold in OryCun2.0 and chr 3 in mOryCun1.1 (renumbered); E (MC1R) has no
        chromosome assigned. Treating them as independent of the others is an assumption, not a finding. B and C are
        drawn as one pair because they share OCU1. Random orientation: Griffiths et al., Introduction to Genetic
        Analysis, ch. 3–4.
      </SourceNote>
    </>
  );
}

function Step3() {
  const W = 360;
  const H = 250;
  const x0 = 40;
  const y0 = H - 36;
  const pw = W - x0 - 12;
  const ph = y0 - 18;
  const xx = (d: number) => x0 + (d / 150) * pw;
  const yy = (r: number) => y0 - (r / 0.55) * ph;
  const pts: string[] = [];
  for (let d = 0; d <= 150; d += 3) pts.push(`${xx(d)},${yy(0.5 * (1 - Math.exp((-2 * d) / 100)))}`);
  return (
    <>
      <Lab>Chance two genes get split vs map distance</Lab>
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full max-w-[560px] font-mono" role="img" aria-label="Recombination rate rises with map distance and levels off at 50%">
        <line x1={x0} y1={y0} x2={x0 + pw} y2={y0} stroke="#13203B" />
        <line x1={x0} y1={y0} x2={x0} y2={14} stroke="#13203B" />
        <line x1={x0} y1={yy(0.5)} x2={x0 + pw} y2={yy(0.5)} stroke="#525C72" strokeDasharray="4 4" />
        <text x={x0 + pw} y={yy(0.5) - 6} textAnchor="end" fontSize={11} fill="#525C72">
          50% = looks unlinked
        </text>
        {[0, 0.1, 0.2, 0.3, 0.4, 0.5].map((r) => (
          <text key={r} x={x0 - 5} y={yy(r) + 4} textAnchor="end" fontSize={10}>
            {Math.round(r * 100)}%
          </text>
        ))}
        {[0, 50, 100, 150].map((d) => (
          <text key={d} x={xx(d)} y={y0 + 15} textAnchor="middle" fontSize={10}>
            {d}
          </text>
        ))}
        <text x={x0 + pw / 2} y={H - 3} textAnchor="middle" fontSize={11}>
          map distance (cM)
        </text>
        <polyline points={pts.join(' ')} fill="none" stroke="#1E2E55" strokeWidth={3} />
        <circle cx={xx(38.8)} cy={yy(0.358)} r={6} fill="#F5D76E" stroke="#13203B" />
        <line x1={xx(38.8)} y1={yy(0.358) - 6} x2={xx(30)} y2={yy(0.44)} stroke="#13203B" />
        <text x={xx(4)} y={yy(0.455)} fontSize={11}>
          B–C · 36% observed
        </text>
      </svg>
      <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
        <Callout>
          <b>cM is not Mb.</b> A centimorgan is 1% recombination, not a length of DNA. B and C are 86 Mb apart; crossover
          hot and cold spots mean another 86 Mb stretch could map very differently.
        </Callout>
        <Callout>
          <b>Interference.</b> One crossover makes another nearby less likely. For far-apart genes, a double crossover
          can put them back together and hide the event.
        </Callout>
      </div>
      <Callout>
        <b>Bucks and does differ.</b> Castle&rsquo;s 1936 rabbit map puts C–B at about 43 units in does and 35 in bucks.
        Many mammals show a sex difference like this. The app uses one averaged rate.
      </Callout>
      <SourceNote>
        Curve: Haldane map function, r = ½(1 − e^(−2d/100)), which assumes no interference; a teaching model, not
        rabbit data. B–C point: observed rate from Castle 1924 (35.8% of 1,006 backcross young), placed at the
        sex-averaged Castle 1936 distance. Sex-specific map: Castle 1936, PNAS 22:222. Interference and sex differences:
        Petkov et al. 2007, Trends Genet 23:539; Capilla-Pérez et al. 2021, PNAS 118:e2023613118. We could not open the
        1936 paper or the two reviews ourselves; figures are as cited in secondary sources.
      </SourceNote>
    </>
  );
}

function Step4Static() {
  const out = calculateCross(HET_DOE, REC_BUCK, { phase: { parent1: 'cis' } });
  const hi = Math.max(...out.map((o) => o.probability)) * 100;
  const lo = Math.min(...out.map((o) => o.probability)) * 100;
  const par = ((1 - R) / 2) * 100;
  const rec = (R / 2) * 100;
  return (
    <>
      <Lab>Chance of each single kit genotype</Lab>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[14px]">
          <thead>
            <tr className="kicker border-b border-rule text-left text-[10.5px] text-ink-muted">
              <th className="py-1.5 font-normal" />
              <th className="py-1.5 font-normal">Independent</th>
              <th className="py-1.5 font-normal">B–C linked, {Math.round(R * 100)}%</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-rule">
              <td className="py-1.5">
                Keeps <span className="font-mono">B C</span> or <span className="font-mono">b c</span> (16 types)
              </td>
              <td className="py-1.5 font-mono">3.125% each</td>
              <td className="py-1.5 font-mono font-bold">{fmtPct(hi)} each</td>
            </tr>
            <tr className="border-b border-rule">
              <td className="py-1.5">
                Splits to <span className="font-mono">B c</span> or <span className="font-mono">b C</span> (16 types)
              </td>
              <td className="py-1.5 font-mono">3.125% each</td>
              <td className="py-1.5 font-mono font-bold">{fmtPct(lo)} each</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
        <div>
          <Lab>Kits’ B–C combination · independent</Lab>
          {['B C', 'b c', 'B c', 'b C'].map((k) => (
            <Bar key={k} k={k} v={25} max={40} />
          ))}
        </div>
        <div>
          <Lab>Kits’ B–C combination · linked</Lab>
          {['B C', 'b c', 'B c', 'b C'].map((k, i) => (
            <Bar key={k} k={k} v={i < 2 ? par : rec} max={40} butter />
          ))}
        </div>
      </div>
      <Callout>
        A, D and E still split 50/50 each, whatever happens at B and C. If her B and C had come in as{' '}
        <b className="font-mono">B c</b> / <b className="font-mono">b C</b>, the bars would flip: {rec} / {rec} / {par} /{' '}
        {par}.
      </Callout>
      <SourceNote>
        Computed by the app&rsquo;s engine: 32 egg types × one sperm type. Parental B–C types (1 − 0.36)/2 = 32% each,
        recombinant 0.36/2 = 18% each, times ½ for each of A, D and E. D and E are assumed independent (positions
        uncertain or unknown).
      </SourceNote>
    </>
  );
}

function Step4Yours({ dam, sire, phase }: { dam: G; sire: G; phase: Record<'parent1' | 'parent2', BCPhase> }) {
  const key: 'parent1' | 'parent2' = isBCDoubleHet(dam) ? 'parent1' : 'parent2';
  const role = key === 'parent1' ? 'doe' : 'buck';
  const g = key === 'parent1' ? dam : sire;
  const chosen = phase[key];
  const shownPhase: Exclude<BCPhase, 'unknown'> = chosen === 'unknown' ? 'cis' : chosen;
  const linkedPhase = { ...phase, [key]: shownPhase };
  const unlinked = bcGametes(g, 'unknown');
  const linked = bcGametes(g, shownPhase);
  const keys = [...linked.keys()];
  const before = summarizeLitter(dam, sire, {});
  const after = new Map(summarizeLitter(dam, sire, { phase: linkedPhase }).map((x) => [x.title, x.probability]));
  return (
    <>
      <Lab>
        Your {role}&rsquo;s B–C sex cells ·{' '}
        <span className="normal-case tracking-normal">{phaseLabel(g, shownPhase)}</span>
        {chosen === 'unknown' ? ' (if this is how they came in)' : ''}
      </Lab>
      <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
        <div>
          <p className="kicker mb-1 text-[10.5px] text-ink-muted">Unlinked</p>
          {keys.map((k) => (
            <Bar key={k} k={k.replace('|', ' ')} v={(unlinked.get(k) ?? 0) * 100} max={40} />
          ))}
        </div>
        <div>
          <p className="kicker mb-1 text-[10.5px] text-ink-muted">Linked, {Math.round(R * 100)}%</p>
          {keys.map((k) => (
            <Bar key={k} k={k.replace('|', ' ')} v={(linked.get(k) ?? 0) * 100} max={40} butter />
          ))}
        </div>
      </div>
      <Lab>Your litter&rsquo;s looks · unlinked vs linked</Lab>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[14px]">
          <thead>
            <tr className="kicker border-b border-rule text-left text-[10.5px] text-ink-muted">
              <th className="py-1.5 font-normal">Look</th>
              <th className="py-1.5 text-right font-normal">Unlinked</th>
              <th className="py-1.5 text-right font-normal">Linked</th>
            </tr>
          </thead>
          <tbody>
            {before.slice(0, 8).map((x) => (
              <tr key={x.title} className="border-b border-rule">
                <td className="py-1.5">{x.title}</td>
                <td className="py-1.5 text-right font-mono">{fmtPct(x.probability * 100)}</td>
                <td className="py-1.5 text-right font-mono font-bold">{fmtPct((after.get(x.title) ?? 0) * 100)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {before.every((x) => Math.abs((after.get(x.title) ?? 0) - x.probability) < 1e-9) && (
        <Callout>
          In this pairing linkage shifts which genotypes the kits carry, but not how any of them look: the other
          parent&rsquo;s genes at B or C hide the difference. It matters again in the next generation, when these kits
          are bred.
        </Callout>
      )}
      <Callout>
        {chosen === 'unknown'
          ? `You haven't said which B and C your ${role} inherited together, so the litter above the fold uses the unlinked column. If they came in the other way round, the linked bars flip. Set it under the ${role} if you know.`
          : `You set this pairing under the ${role}, so the litter odds already use the linked column.`}
      </Callout>
      <SourceNote>Computed by the app&rsquo;s engine with {Math.round(R * 100)}% B–C recombination (Castle 1924).</SourceNote>
    </>
  );
}

/** "Going deeper": independent assortment vs linkage, using the user's cross where it can. */
export function GoingDeeper() {
  const dam = useGeneticStore((s) => s.parent1);
  const sire = useGeneticStore((s) => s.parent2);
  const phase = useGeneticStore((s) => s.bcPhase);
  const [step, setStep] = useState(0);
  const [useExample, setUseExample] = useState(false);
  const yoursLinked = isBCDoubleHet(dam) || isBCDoubleHet(sire);

  const copy = [
    <>
      <div className="flex gap-1.5" role="group" aria-label="Which cross">
        {[
          [false, 'Your cross'],
          [true, 'Example cross'],
        ].map(([v, label]) => (
          <button
            key={String(v)}
            type="button"
            aria-pressed={useExample === v}
            onClick={() => setUseExample(v as boolean)}
            className={`border px-2.5 py-1 font-mono text-[12px] ${useExample === v ? 'border-ink bg-ink text-paper' : 'border-rule text-ink'}`}
          >
            {label as string}
          </button>
        ))}
      </div>
      {useExample ? (
        <p>
          A doe that is <b className="font-mono">AA Bb CC dd EE</b> and a buck that is{' '}
          <b className="font-mono">Aa bb cc dd ee</b>.
        </p>
      ) : (
        <p>The doe and buck you picked above, gene by gene.</p>
      )}
      <p>
        A parent can only shuffle genes it carries in two different versions. Count those mixed genes, n, and a parent
        makes 2<sup>n</sup> kinds of egg or sperm.
      </p>
      <p className="serif-note text-ink-soft">
        {(() => {
          const d = useExample ? EX_DOE : dam;
          const s = useExample ? EX_BUCK : sire;
          const ids = useExample ? FIVE : ALL;
          const nd = ids.filter((id) => d[id] && mixed(d[id])).length;
          const ns = ids.filter((id) => s[id] && mixed(s[id])).length;
          return `Here the doe has n = ${nd} (${2 ** nd} kinds of egg) and the buck n = ${ns} (${2 ** ns} kinds of sperm).`;
        })()}
      </p>
    </>,
    <>
      <p>
        In the first division of meiosis, each chromosome pair lines up across the middle of the cell. Which copy faces
        which side is random, and each pair does it on its own.
      </p>
      <p>So genes on different chromosomes are inherited independently. A (chromosome 4) tells you nothing about En (chromosome 15).</p>
      <p>
        A doe mixed at 5 independent genes makes 2<sup>5</sup> = 32 kinds of egg, each 1 in 32.
      </p>
    </>,
    <>
      <p>
        When a chromosome pair lines up, the two copies are zipped together along their length by a protein scaffold,
        the synaptonemal complex. Crossovers happen there and later show as chiasmata, X shapes where the copies have
        swapped segments.
      </p>
      <p>Crossovers land at roughly random spots. The further apart two genes are, the more likely one falls between them, so they split up more often.</p>
      <p>The split rate tops out at 50%. Genes far apart on one chromosome look just like genes on different chromosomes.</p>
      <p className="serif-note text-ink-soft">
        The coiling of the DNA helix doesn&rsquo;t cause this. Crossovers are cut-and-repair events between the paired copies.
      </p>
    </>,
    yoursLinked ? (
      <>
        <p>Your cross has a parent mixed at both B and C, so here are your own numbers.</p>
        <p>The sex cells that keep the parent&rsquo;s inherited B–C pairing are almost twice as common as the ones that split it.</p>
        <p className="serif-note text-ink-soft">Genes on other chromosomes still split 50/50, whatever happens at B and C.</p>
      </>
    ) : (
      <>
        <p>
          The doe is <b className="font-mono">Aa Bb Cc Dd Ee</b>. She got <b className="font-mono">B C</b> from one parent
          and <b className="font-mono">b c</b> from the other, so B and C start out together on one chromosome.
        </p>
        <p>
          Mate her to an <b className="font-mono">aa bb cc dd ee</b> buck. His sperm all carry the same letters, so each
          kit mirrors the egg it came from.
        </p>
        <p>
          Still 32 kinds of kit. With linkage they&rsquo;re no longer equal: the 16 that keep her B–C pairing are almost
          twice as common as the 16 that split it.
        </p>
      </>
    ),
  ];

  const figs = [
    <Step1 key="1" dam={dam} sire={sire} phase={phase} useExample={useExample} />,
    <Step2 key="2" />,
    <Step3 key="3" />,
    yoursLinked ? <Step4Yours key="4" dam={dam} sire={sire} phase={phase} /> : <Step4Static key="4" />,
  ];

  return (
    <Stepper
      id="going-deeper"
      kicker="Going deeper"
      titles={yoursLinked ? [...TITLES.slice(0, 3), 'Your cross, with B and C linked'] : TITLES}
      step={step}
      onStep={setStep}
      copy={copy[step]}
      fig={figs[step]}
    />
  );
}
