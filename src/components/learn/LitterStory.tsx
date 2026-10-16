import { useState } from 'react';
import { BC_RECOMBINATION } from '../../utils/geneticEngine';
import { Bar, BUCK, Callout, Chromo, DOE, DOE2, Lab, Ruler, SourceNote, Stepper, Unc } from './storyParts';

const R = Math.round(BC_RECOMBINATION * 100);
const PAR = (100 - R) / 2;
const REC = R / 2;

const TITLES = [
  'Each parent has two copies of every chromosome',
  'Making eggs: the pair swaps a piece',
  'Fertilization: one copy from each parent',
  'Why linked genes bend the Punnett square',
];

const LOCUS_TABLE: { id: string; gene: string; chr: string; pos: string; status: React.ReactNode }[] = [
  { id: 'A', gene: 'ASIP', chr: 'OCU4', pos: '5.44 of 91.4 Mb', status: 'Mapped' },
  { id: 'B', gene: 'TYRP1', chr: 'OCU1', pos: '41.35 of 194.9 Mb', status: 'Mapped · linked to C' },
  { id: 'C', gene: 'TYR', chr: 'OCU1', pos: '127.56 of 194.9 Mb', status: 'Mapped · linked to B' },
  {
    id: 'D',
    gene: 'MLPH',
    chr: 'Unplaced scaffold',
    pos: '—',
    status: (
      <>
        <Unc>UNCERTAIN</Unc> chr 3 in mOryCun1.1, which numbers chromosomes differently
      </>
    ),
  },
  {
    id: 'E',
    gene: 'MC1R',
    chr: 'Unplaced scaffold',
    pos: '—',
    status: (
      <>
        <Unc>UNKNOWN</Unc> no chromosome assigned in either build
      </>
    ),
  },
  { id: 'En', gene: 'KIT', chr: 'OCU15', pos: '93.93 of 109.1 Mb', status: 'Associated (Fontanesi 2014)' },
  { id: 'V', gene: 'Not identified', chr: '—', pos: '—', status: <Unc>UNKNOWN</Unc> },
  { id: 'Si', gene: 'Not identified', chr: '—', pos: '—', status: <Unc>UNKNOWN</Unc> },
];

const POSITIONS_NOTE =
  'Yellow bands are real gene positions (Ensembl OryCun2.0): B = TYRP1 at 41.35 Mb, C = TYR at 127.56 Mb, chromosome 1 = 194.85 Mb. Grey stripes are decorative, not real G-banding.';

function Step1Fig() {
  return (
    <>
      <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
        <div>
          <Lab>The doe · chromosome 1 pair</Lab>
          <Chromo b="B" c="C" fill={DOE} label="from her dam" />
          <Chromo b="b" c="c" fill={DOE2} label="from her sire" />
          <Ruler />
        </div>
        <div>
          <Lab>The buck · chromosome 1 pair</Lab>
          <Chromo b="b" c="c" fill={BUCK} label="from his dam" />
          <Chromo b="b" c="c" fill={BUCK} label="from his sire" />
          <Ruler />
        </div>
      </div>
      <Lab>Where every coat gene sits · published data only</Lab>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13.5px]">
          <thead>
            <tr className="kicker border-b border-rule text-left text-[10.5px] text-ink-muted">
              <th className="py-1.5 pr-2 font-normal">Locus</th>
              <th className="py-1.5 pr-2 font-normal">Gene</th>
              <th className="py-1.5 pr-2 font-normal">Chromosome</th>
              <th className="hidden py-1.5 pr-2 font-normal sm:table-cell">Position</th>
              <th className="py-1.5 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {LOCUS_TABLE.map((r) => (
              <tr key={r.id} className="border-b border-rule">
                <td className="py-1.5 pr-2 font-bold">{r.id}</td>
                <td className="py-1.5 pr-2 italic">{r.gene}</td>
                <td className="py-1.5 pr-2">
                  {r.chr}
                  {r.pos !== '—' && <span className="block font-mono text-[11.5px] text-ink-muted sm:hidden">{r.pos}</span>}
                </td>
                <td className="hidden py-1.5 pr-2 font-mono text-[12.5px] sm:table-cell">{r.pos}</td>
                <td className="py-1.5">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SourceNote>
        {POSITIONS_NOTE} Sources: Ensembl OryCun2.0 gene records; NCBI Gene (mOryCun1.1); Fontanesi et al. 2010
        (MC1R, TYRP1), 2014 (KIT).
      </SourceNote>
    </>
  );
}

function Step2Fig() {
  const eggs: [string, string, string, string | undefined, string][] = [
    ['B', 'C', DOE, undefined, `Parental · about ${PAR}%`],
    ['b', 'c', DOE2, undefined, `Parental · about ${PAR}%`],
    ['B', 'c', DOE, DOE2, `Recombinant · about ${REC}%`],
    ['b', 'C', DOE2, DOE, `Recombinant · about ${REC}%`],
  ];
  return (
    <>
      <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
        <div>
          <Lab>1 · Pair up</Lab>
          <Chromo b="B" c="C" fill={DOE} showCross />
          <Chromo b="b" c="c" fill={DOE2} showCross caption="dashed line: where they cross over" />
        </div>
        <div>
          <Lab>2 · Swap ends</Lab>
          <Chromo b="B" c="c" fill={DOE} swap={DOE2} />
          <Chromo b="b" c="C" fill={DOE2} swap={DOE} />
        </div>
      </div>
      <Lab>3 · Four kinds of egg</Lab>
      <div className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2">
        {eggs.map(([b, c, f, s, cap]) => (
          <Chromo
            key={b + c}
            b={b}
            c={c}
            fill={f}
            swap={s}
            caption={s ? <b className="text-ink">{cap}</b> : cap}
          />
        ))}
      </div>
      <SourceNote>
        Percentages: Castle 1924 backcross, 35.8% recombinant between B and C among 1,006 young, split evenly between
        the two new types. The crossover is drawn at an illustrative spot. Sources: Castle 1924, PNAS 10:486; Castle
        1936, PNAS 22:222.
      </SourceNote>
    </>
  );
}

function Step3Fig() {
  return (
    <>
      <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
        <div>
          <Lab>Egg · from the doe</Lab>
          <Chromo b="B" c="c" fill={DOE} swap={DOE2} caption="a recombinant egg" />
        </div>
        <div>
          <Lab>Sperm · from the buck</Lab>
          <Chromo b="b" c="c" fill={BUCK} caption="every sperm carries b c" />
        </div>
      </div>
      <p aria-hidden className="my-2 text-center font-mono text-xl text-ink-muted">↓</p>
      <Lab>The kit · chromosome 1 pair</Lab>
      <div className="max-w-[520px]">
        <Chromo b="B" c="c" fill={DOE} swap={DOE2} label="from the doe" />
        <Chromo b="b" c="c" fill={BUCK} label="from the buck" />
      </div>
      <p className="mt-3 text-[15px]">
        <b>cc → albino.</b> Two copies of c hide whatever B carries, so this kit is white with red eyes but can pass
        on black.
      </p>
      <SourceNote>{POSITIONS_NOTE}</SourceNote>
    </>
  );
}

function Step4Fig() {
  const kits: [string, string, number][] = [
    ['Black, full colour', 'B C / b c', PAR],
    ['Albino, carries brown', 'b c / b c', PAR],
    ['Albino, carries black', 'B c / b c', REC],
    ['Brown, full colour', 'b C / b c', REC],
  ];
  return (
    <>
      <Lab>The doe&rsquo;s eggs · <span className="normal-case tracking-normal">B C / b c</span> · if B and C were unlinked</Lab>
      {['B C', 'b c', 'B c', 'b C'].map((k) => (
        <Bar key={k} k={k} v={25} max={40} />
      ))}
      <Lab>The doe&rsquo;s eggs · linked, {R}% recombination</Lab>
      {['B C', 'b c', 'B c', 'b C'].map((k, i) => (
        <Bar key={k} k={k} v={i < 2 ? PAR : REC} max={40} butter />
      ))}
      <Lab>Kits from this doe × a <span className="normal-case tracking-normal">b c / b c</span> buck</Lab>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[14px]">
          <thead>
            <tr className="kicker border-b border-rule text-left text-[10.5px] text-ink-muted">
              <th className="py-1.5 font-normal">Kit</th>
              <th className="py-1.5 font-normal">Chromosome 1 pair</th>
              <th className="py-1.5 text-right font-normal">Unlinked</th>
              <th className="py-1.5 text-right font-normal">Linked</th>
            </tr>
          </thead>
          <tbody>
            {kits.map(([name, g, v]) => (
              <tr key={g} className="border-b border-rule">
                <td className="py-1.5">{name}</td>
                <td className="py-1.5 font-mono text-[13px]">{g}</td>
                <td className="py-1.5 text-right font-mono">25%</td>
                <td className="py-1.5 text-right font-mono font-bold">{v}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Callout>
        Progeny Predictor uses these linked odds once you say which B and C a parent inherited together. Until then it
        uses the unlinked numbers, which are the average of the two possible pairings.
      </Callout>
      <SourceNote>
        {R}% from Castle 1924. Real rates vary by family and by parent&rsquo;s sex (Castle 1936 reports a shorter map in
        bucks); we use one sex-averaged rate.
      </SourceNote>
    </>
  );
}

const COPY = [
  <>
    <p>
      Chromosome 1 of a rabbit carries two coat genes: <b>B</b> (black or brown, gene <i>TYRP1</i>) and <b>C</b> (full
      colour or albino, gene <i>TYR</i>). They sit about 86 million DNA letters apart.
    </p>
    <p>
      Every rabbit has two copies of chromosome 1, one from its mother and one from its father. Here the doe carries{' '}
      <b>B C</b> on one copy and <b>b c</b> on the other.
    </p>
    <p className="serif-note text-ink-soft">
      A and En sit on other chromosomes. D and E are not yet placed on a numbered chromosome, and V and Si have no
      known gene.
    </p>
  </>,
  <>
    <p>
      Before the doe makes an egg, her two copies of chromosome 1 line up side by side. They often cross over: both
      break at the same point and swap ends.
    </p>
    <p>
      When the swap lands between B and C, she makes two <b>new</b> combinations, <b>B c</b> and <b>b C</b>, that
      neither of her own copies had.
    </p>
    <p className="serif-note text-ink-soft">Castle&rsquo;s backcross rabbits did this about {R} times in 100.</p>
  </>,
  <>
    <p>Each kit gets exactly one chromosome 1 from the doe&rsquo;s egg and one from the buck&rsquo;s sperm. The pair is complete again.</p>
    <p>
      The buck here is <b>b c / b c</b>, so every sperm carries <b>b c</b>. Whatever the egg carried decides the
      kit&rsquo;s colour.
    </p>
    <p className="serif-note text-ink-soft">
      This egg was a recombinant, so the kit is <b>B c / b c</b>: it carries black, but it&rsquo;s albino.
    </p>
  </>,
  <>
    <p>A plain Punnett square assumes each gene is shuffled on its own, so the doe&rsquo;s four egg types come out 25% each.</p>
    <p>B and C share a chromosome, so the combinations she inherited tend to stay together. Only crossovers make the mixed eggs.</p>
    <p>
      <b>
        For this cross, that&rsquo;s about {PAR} in 100 instead of 25.
      </b>
    </p>
    <p className="serif-note text-ink-soft">Genes on different chromosomes, like A (OCU4) and En (OCU15), still follow the plain square.</p>
  </>,
];

const FIGS = [Step1Fig, Step2Fig, Step3Fig, Step4Fig];

/** "How a litter is made": chromosome 1, crossover, fertilization and linked odds, in four steps. */
export function LitterStory() {
  const [step, setStep] = useState(0);
  const Fig = FIGS[step];
  return (
    <Stepper id="litter-story" kicker="How a litter is made" titles={TITLES} step={step} onStep={setStep} copy={COPY[step]} fig={<Fig />} />
  );
}
