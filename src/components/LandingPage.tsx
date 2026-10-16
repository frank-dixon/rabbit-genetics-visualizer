import { useMemo } from 'react';
import { PARENT_PRESETS } from '../data/meatRabbitBreeds';
import { useGeneticStore } from '../store/useGeneticStore';
import { summarizeLitter } from '../utils/litterSummary';
import { furVars } from '../utils/furTone';

const DEMO = { parent1: 'nz-white-field', parent2: 'nz-red' } as const;

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  const loadParentPreset = useGeneticStore((s) => s.loadParentPreset);
  const clearParentPreset = useGeneticStore((s) => s.clearParentPreset);

  const demo = useMemo(() => {
    const p1 = PARENT_PRESETS.find((p) => p.id === DEMO.parent1);
    const p2 = PARENT_PRESETS.find((p) => p.id === DEMO.parent2);
    if (!p1 || !p2) return null;
    const top = summarizeLitter(p1.genotype, p2.genotype)[0];
    return { p1, p2, top };
  }, []);

  const seeDemo = () => {
    if (demo) {
      loadParentPreset('parent1', demo.p1.id, demo.p1.genotype);
      loadParentPreset('parent2', demo.p2.id, demo.p2.genotype);
    }
    onStart();
  };

  const startOwn = () => {
    clearParentPreset('parent1');
    clearParentPreset('parent2');
    onStart();
  };

  const features = [
    { k: '01 · Pair', t: 'Buck × doe', d: 'Breed presets or a custom genotype at every locus.' },
    { k: '02 · Predict', t: 'Litter odds', d: 'Every phenotype, its share of the litter, and why.' },
    { k: '03 · Learn', t: 'See the why', d: 'Plain English first. Open any answer for Punnett squares and a 3D chromosome.', lichen: true },
    { k: '04 · Keep', t: 'Save crosses', d: 'Saved on this device, free. No account needed.' },
  ];

  return (
    <main className="relative flex-1">
      <section className="relative mx-auto grid max-w-[1440px] grid-cols-1 lg:min-h-[536px] lg:grid-cols-2">
        <div className="relative z-10 px-4 pb-8 pt-8 sm:px-9 lg:pt-14">
          <h1 className="headline text-[clamp(5rem,15vw,13rem)] text-ink">Progeny</h1>
          <p className="mt-6 max-w-[36rem] text-xl leading-snug text-ink sm:text-2xl">
            Pick two meat-rabbit parents and see every kit&apos;s coat and eye color: Punnett math across
            every locus, in plain English.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={seeDemo} className="btn-block btn-forest !px-6 !py-4">
              See a demo herd →
            </button>
            <button type="button" onClick={startOwn} className="btn-block btn-outline !px-6 !py-4 text-ink">
              Start my own
            </button>
          </div>
          <p className="serif-note mt-4 text-[15px] text-ink-muted">
            Free, no account. Your work is saved on this device.
          </p>
        </div>

        <div className="relative min-h-[420px] bg-[var(--moss)] lg:min-h-0" aria-hidden={!demo}>
          {demo && (
            <figure className="absolute inset-x-[12%] top-8 bottom-16 m-0 lg:inset-x-[18%] lg:top-10 lg:bottom-20">
              <div className="fur-portrait h-full w-full" style={furVars(demo.top.genotype)} role="img"
                aria-label={`Illustration of a ${demo.top.title} kit`} />
              <figcaption className="absolute -bottom-10 right-[-8%] w-[min(20rem,90%)] border border-ink bg-paper px-4 py-3 text-ink">
                <span className="kicker text-[10px] text-ink-muted">Kit 01 · demo litter</span>
                <span className="block text-lg font-bold leading-tight">
                  {demo.top.title} · {(demo.top.probability * 100).toFixed(1).replace(/\.0$/, '')}%
                </span>
                <span className="serif-note block text-sm">{demo.p1.label} × {demo.p2.label}</span>
              </figcaption>
            </figure>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div
            key={f.k}
            className={`border border-rule p-5 sm:p-6 ${f.lichen ? 'bg-[var(--lichen)] text-[var(--forest)] border-transparent' : 'bg-paper'}`}
          >
            <p className={`kicker text-[10px] ${f.lichen ? 'text-[var(--moss)]' : 'text-ink-muted'}`}>{f.k}</p>
            <h2 className="headline mt-2 text-2xl sm:text-[34px]">{f.t}</h2>
            <p className={`mt-2 text-sm sm:text-base ${f.lichen ? '' : 'text-ink-soft'}`}>{f.d}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
