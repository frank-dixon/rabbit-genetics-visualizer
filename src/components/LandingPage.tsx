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
    { k: '03 · Learn', t: 'Simple or Nerd', d: 'Plain English, or genotypes, Punnett squares and a 3D chromosome.', lichen: true },
    { k: '04 · Keep', t: 'Save crosses', d: 'Saved on this device, free. No account needed.' },
  ];

  return (
    <main className="relative flex-1">
      <section className="relative mx-auto grid max-w-6xl grid-cols-1 gap-6 px-3 pt-6 sm:px-5 lg:min-h-[536px] lg:grid-cols-2">
        <div className="relative z-10 pb-8 pt-6 lg:pt-12">
          <p className="mb-4 flex flex-wrap items-center gap-3"><span className="tag-cta">Rabbit genetics</span><span className="kicker glass px-2 py-1 text-[10px] text-ink-soft">Litter predictor</span></p>
          <h1 className="headline text-[clamp(4rem,9vw,8rem)]">Progeny</h1>
          <p className="glass mt-6 max-w-[36rem] px-4 py-3 text-[15px] leading-relaxed text-ink">
            Pick two meat-rabbit parents and see every kit&apos;s coat and eye color: Punnett math across
            every locus, in plain English.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={seeDemo} className="btn-block btn-lichen !px-6 !py-3.5">
              See a demo herd →
            </button>
            <button type="button" onClick={startOwn} className="btn-block btn-forest !px-6 !py-3.5">
              Start my own
            </button>
          </div>
          <p className="serif-note mt-4 text-[15px] text-ink-muted">
            Free, no account. Your work is saved on this device.
          </p>
        </div>

        <div className="glass relative min-h-[420px] lg:min-h-0" aria-hidden={!demo}>
          {demo && (
            <figure className="absolute inset-x-[12%] top-8 bottom-16 m-0 lg:inset-x-[18%] lg:top-10 lg:bottom-20">
              <div className="fur-portrait h-full w-full" style={furVars(demo.top.genotype)} role="img"
                aria-label={`Illustration of a ${demo.top.title} kit`} />
              <figcaption className="absolute -bottom-10 right-[-8%] w-[min(20rem,90%)] glass !bg-[var(--bg-from)]/90 px-4 py-3 text-ink">
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

      <section className="mx-auto mt-8 grid max-w-6xl grid-cols-2 gap-3 px-3 pb-10 sm:px-5 lg:grid-cols-4">
        {features.map((f) => (
          <div
            key={f.k}
            className={`glass p-5 sm:p-6 ${f.lichen ? '!border-[var(--accent)]' : ''}`}
          >
            <p className={`kicker text-[10px] ${f.lichen ? 'text-[var(--accent)]' : 'text-ink-muted'}`}>{f.k}</p>
            <h2 className="headline mt-2 text-2xl sm:text-[34px]">{f.t}</h2>
            <p className={`mt-2 text-sm sm:text-base text-ink-soft`}>{f.d}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
