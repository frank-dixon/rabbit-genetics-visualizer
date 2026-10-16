import { useGeneticStore } from '../store/useGeneticStore';
import { BC_RECOMBINATION, isBCDoubleHet, type BCPhase } from '../utils/geneticEngine';
import { WhyDisclosure } from './WhyDisclosure';

type ParentKey = 'parent1' | 'parent2';
type GenotypeMap = Record<string, [string, string]>;

/** "B C / b c" for a phase, from the parent's own allele order. */
export function phaseLabel(genotype: GenotypeMap, phase: Exclude<BCPhase, 'unknown'>): string {
  const [b0, b1] = genotype.B;
  const [c0, c1] = phase === 'cis' ? genotype.C : [genotype.C[1], genotype.C[0]];
  return `${b0} ${c0} / ${b1} ${c1}`;
}

/**
 * Shown only when a parent is mixed at both B and C. Lets the breeder say which
 * B and C came in together (from a pedigree or a known parent); otherwise odds stay unlinked.
 */
export function BCPhasePicker({ parentKey, role }: { parentKey: ParentKey; role: 'doe' | 'buck' }) {
  const genotype = useGeneticStore((s) => s[parentKey]);
  const phase = useGeneticStore((s) => s.bcPhase[parentKey]);
  const setBcPhase = useGeneticStore((s) => s.setBcPhase);
  if (!isBCDoubleHet(genotype)) return null;
  const r = Math.round(BC_RECOMBINATION * 100);
  const options: { value: BCPhase; label: string }[] = [
    { value: 'unknown', label: 'Not known' },
    { value: 'cis', label: phaseLabel(genotype, 'cis') },
    { value: 'trans', label: phaseLabel(genotype, 'trans') },
  ];
  return (
    <fieldset className="mt-4 border border-rule bg-paper p-3">
      <legend className="kicker px-1 text-[11px] text-ink">B and C: which came in together?</legend>
      <p className="text-[14px] leading-snug text-ink-soft">
        B and C share chromosome 1, so the pairing this {role} inherited tends to stay together.
      </p>
      <div className="mt-2 flex flex-wrap gap-2" role="radiogroup">
        {options.map((o) => (
          <label
            key={o.value}
            className={`cursor-pointer border px-3 py-1.5 font-mono text-[13px] ${
              phase === o.value ? 'border-ink bg-ink text-paper' : 'border-rule text-ink'
            }`}
          >
            <input
              type="radio"
              className="sr-only"
              name={`${parentKey}-bc-phase`}
              checked={phase === o.value}
              onChange={() => setBcPhase(parentKey, o.value)}
            />
            {o.label}
          </label>
        ))}
      </div>
      <WhyDisclosure label="Why?">
        <p>
          Each chromosome 1 the {role} carries holds one B and one C. Unless a crossover lands between them, an egg
          or sperm gets both from the same copy. Castle&rsquo;s 1924 rabbits split B and C about {r} times in 100.
        </p>
        <p>
          If you know which pairing came from which grandparent (say a {role} out of a brown, full-colour parent),
          pick it and the odds use linkage: {100 - r}% of sex cells keep that pairing, {r}% swap it.
        </p>
        <p>
          <b>Not known</b> uses plain Punnett odds. Either pairing is equally likely, and averaging the two gives
          exactly the unlinked numbers, so this is the fair default rather than a guess.
        </p>
      </WhyDisclosure>
    </fieldset>
  );
}
