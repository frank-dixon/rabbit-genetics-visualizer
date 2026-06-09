import { useState, type ReactNode } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { WORKSPACE_MAX_WIDTH } from '../constants/layout';
import { InteractivePunnettLab } from './learn/InteractivePunnettLab';
import { IndependentAssortmentDemo } from './learn/IndependentAssortmentDemo';

interface MendelianLearnPageProps {
  onBack: () => void;
}

interface ConceptSection {
  id: string;
  title: string;
  summary: string;
  body: ReactNode;
}

const CONCEPT_SECTIONS: ConceptSection[] = [
  {
    id: 'genes',
    title: 'Genes, loci, and alleles',
    summary: 'A locus is a address on a chromosome; alleles are the versions a parent can pass on.',
    body: (
      <>
        <p>
          Rabbits inherit two copies of each autosomal gene — one from each parent. We write a{' '}
          <strong>genotype</strong> with two allele symbols, like <code className="font-mono">Bb</code>{' '}
          for the brown/black locus.
        </p>
        <p>
          <strong>Homozygous</strong> means both alleles match (<code className="font-mono">BB</code> or{' '}
          <code className="font-mono">bb</code>). <strong>Heterozygous</strong> means one of each (
          <code className="font-mono">Bb</code>).
        </p>
      </>
    ),
  },
  {
    id: 'dominance',
    title: 'Dominant and recessive',
    summary: 'Complete dominance: one dominant allele is enough to show the dominant phenotype.',
    body: (
      <>
        <p>
          At the B locus, <strong>B</strong> (black pigment) is dominant over <strong>b</strong>{' '}
          (chocolate). Genotypes <code className="font-mono">BB</code>,{' '}
          <code className="font-mono">Bb</code>, and <code className="font-mono">bB</code> all look
          black; only <code className="font-mono">bb</code> is chocolate.
        </p>
        <p>
          Rabbit coat color has plenty of exceptions — co-dominance, epistasis, and modifier genes —
          but Punnett squares start with this simple model.
        </p>
      </>
    ),
  },
  {
    id: 'gametes',
    title: 'Gametes and segregation',
    summary: 'Each parent contributes one allele per locus to every offspring.',
    body: (
      <>
        <p>
          During meiosis, homologous chromosomes separate so each sperm or egg carries only one
          allele per locus. A <code className="font-mono">Bb</code> rabbit produces 50%{' '}
          <strong>B</strong> gametes and 50% <strong>b</strong> gametes.
        </p>
        <p>
          Mendel&apos;s <strong>law of segregation</strong>: the two alleles for a trait separate
          during gamete formation and reunite at random in the zygote.
        </p>
      </>
    ),
  },
  {
    id: 'punnett',
    title: 'Reading a Punnett square',
    summary: 'Rows = one parent\'s gametes, columns = the other\'s; each cell is one fertilization outcome.',
    body: (
      <>
        <p>
          A monohybrid square is a grid of gamete combinations. With heterozygous parents the
          classic ratio is <strong>1 : 2 : 1</strong> genotypes and often <strong>3 : 1</strong>{' '}
          phenotypes under complete dominance.
        </p>
        <p>
          Each cell has equal probability when gametes are equally likely — four cells means 25%
          each, which is why a <code className="font-mono">Bb × Bb</code> cross gives 25%{' '}
          <code className="font-mono">BB</code>, 50% <code className="font-mono">Bb</code>, 25%{' '}
          <code className="font-mono">bb</code>.
        </p>
      </>
    ),
  },
];

export function MendelianLearnPage({ onBack }: MendelianLearnPageProps) {
  const [openConcepts, setOpenConcepts] = useState<Set<string>>(new Set(['genes']));

  const toggleConcept = (id: string) => {
    setOpenConcepts((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <main className="flex-1 min-h-0 overflow-y-auto">
      <div className={`${WORKSPACE_MAX_WIDTH} mx-auto p-4 pb-10 space-y-6`}>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-sky-700 dark:text-sky-400 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to workspace
        </button>

        <header className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Mendelian Inheritance &amp; Punnett Squares
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl">
            A hands-on primer on how parent genotypes become offspring probabilities — the same math
            that powers the progeny predictor, stripped down to one locus at a time.
          </p>
        </header>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Core concepts</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Expand a topic, then try the lab below to see it in action.
          </p>

          <div className="space-y-2">
            {CONCEPT_SECTIONS.map((section) => {
              const isOpen = openConcepts.has(section.id);
              return (
                <div
                  key={section.id}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleConcept(section.id)}
                    className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-950/40"
                  >
                    <ChevronDown
                      className={`h-4 w-4 mt-0.5 shrink-0 text-slate-500 transition-transform ${
                        isOpen ? '' : '-rotate-90'
                      }`}
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {section.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {section.summary}
                      </p>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pl-11 text-sm text-slate-600 dark:text-slate-300 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                      {section.body}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <InteractivePunnettLab />

        <IndependentAssortmentDemo />

        <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-sm text-slate-600 dark:text-slate-300 space-y-3">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            How this connects to the predictor
          </h2>
          <p>
            The workspace cross engine runs the same gamete-combination logic for every modeled locus,
            multiplies independent probabilities, merges identical genotype strings, then resolves
            rabbit-specific phenotypes (albino <code className="font-mono">cc</code> masking, Vienna
            blue-eyed white, silvering at Si, and more).
          </p>
          <p>
            Use this page to build intuition; use the{' '}
            <button
              type="button"
              onClick={onBack}
              className="text-sky-700 dark:text-sky-400 underline underline-offset-2"
            >
              Predictor
            </button>{' '}
            when you need all loci at once on real breed presets.
          </p>
        </section>
      </div>
    </main>
  );
}
