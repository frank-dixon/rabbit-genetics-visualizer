import { useMemo } from 'react';
import { useGeneticStore } from '../store/useGeneticStore';
import { oddsPhrase, summarizeLitter } from '../utils/litterSummary';
import { furVars } from '../utils/furTone';

const pct = (p: number) => `${(p * 100).toFixed(2).replace(/\.?0+$/, '')}%`;

/** Field-grid litter overview: hero headline, top kit tiles and a rarest callout, from the real engine. */
export function LitterSummary() {
  const parent1 = useGeneticStore((s) => s.parent1);
  const parent2 = useGeneticStore((s) => s.parent2);
  const focus = useGeneticStore((s) => s.focusProgenyGenotype);
  const litter = useMemo(() => summarizeLitter(parent1, parent2), [parent1, parent2]);

  if (litter.length === 0) return null;
  const top = litter[0];
  const tiles = litter.slice(0, 4);
  const last = litter[litter.length - 1];
  const rarest = litter.length > 1 && last.probability < top.probability - 1e-9 ? last : null;

  return (
    <section aria-label="Litter overview" className="relative">
      <div className="fur-portrait relative px-4 pb-24 pt-6 text-[var(--mist)] sm:px-9 sm:pb-28 sm:pt-8" style={furVars(top.genotype)}>
        <div className="absolute inset-0 bg-[var(--forest)]/70" style={{ background: 'rgba(20,24,21,.72)' }} aria-hidden />
        <div className="relative">
          <p className="kicker text-[var(--lichen)]">The litter · {litter.length} phenotype{litter.length === 1 ? '' : 's'}</p>
          <h2 className="headline mt-3 max-w-[56rem] text-[clamp(2.75rem,7vw,6.5rem)]">
            {oddsPhrase(top.probability)} wear {top.title.toLowerCase()}.
          </h2>
        </div>
      </div>
      <div className="relative -mt-16 grid grid-cols-1 gap-0 px-4 sm:-mt-20 sm:px-9 lg:grid-cols-[1fr_18rem]">
        <ul className="grid grid-cols-2 lg:grid-cols-4" role="list">
          {tiles.map((kit, i) => (
            <li key={kit.phenotype} className="border border-rule bg-paper">
              <button type="button" className="block w-full text-left" onClick={() => focus(kit.genotype, kit.title)}
                aria-label={`Show genotype for ${kit.title}`}>
                <div className="fur-portrait h-28 sm:h-44" style={furVars(kit.genotype)} />
                <div className="p-3 sm:p-4">
                  <p className="kicker text-[10px] text-ink-muted">Kit {String(i + 1).padStart(2, '0')}</p>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <span className="text-[15px] font-bold leading-tight text-ink sm:text-lg">{kit.title}</span>
                    <span className="headline text-2xl text-teal-deep sm:text-3xl">{pct(kit.probability)}</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-[var(--mist)] dark:bg-paper-2">
                    <div className="h-full bg-[var(--moss)] dark:bg-[var(--lichen)]" style={{ width: `${kit.probability * 100}%` }} />
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
        {rarest && (
          <aside className="flex gap-4 bg-[var(--lichen)] p-5 text-[var(--forest)] lg:block">
            <div className="fur-portrait h-20 w-20 shrink-0 lg:order-last lg:mt-4 lg:h-28 lg:w-full" style={furVars(rarest.genotype)} />
            <div>
              <p className="kicker text-[10px] text-[var(--moss)]">Rarest</p>
              <p className="headline text-5xl lg:text-7xl">{pct(rarest.probability)}</p>
              <p className="font-bold">{rarest.title} · {oddsPhrase(rarest.probability)}</p>
              <p className="serif-note mt-1 text-sm">{rarest.plainEnglish}</p>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}
