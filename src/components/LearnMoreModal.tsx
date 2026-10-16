import { useEffect, useRef } from 'react';
import { useGeneticStore } from '../store/useGeneticStore';
import { punnett, varyingLoci } from '../utils/litterCopy';
import { PunnettSquare } from './PunnettSquare';

interface LearnMoreModalProps {
  open: boolean;
  onClose: () => void;
  onOpenLearn: () => void;
  onOpenCitations: () => void;
}

/** The deep dive: Punnett squares for the loci that vary, how to read them and sources. */
export function LearnMoreModal({ open, onClose, onOpenLearn, onOpenCitations }: LearnMoreModalProps) {
  const dam = useGeneticStore((s) => s.parent1);
  const sire = useGeneticStore((s) => s.parent2);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;
  const loci = varyingLoci(dam, sire);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-[rgba(19,32,59,0.55)] sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="learn-more-title"
        className="max-h-[92vh] w-full overflow-y-auto border border-ink bg-paper sm:max-h-[86vh] sm:w-[min(900px,94vw)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-rule bg-paper px-5 py-4 sm:px-7">
          <div>
            <p className="kicker text-ink-muted">Learn more · the deep dive</p>
            <h2 id="learn-more-title" className="headline mt-1 text-3xl sm:text-4xl">
              How this litter is decided
            </h2>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} className="btn-block btn-outline shrink-0 whitespace-nowrap !px-3 !py-2 text-ink">
            Close ✕
          </button>
        </div>
        <div className="space-y-6 px-5 py-6 sm:px-7">
          <p className="max-w-[42rem] text-lg leading-snug text-ink">
            Every kit gets one copy of each gene from each parent, at random.{' '}
            {loci.length === 0
              ? 'Your doe and buck carry matching pairs at every gene we model, so every kit inherits the same genes.'
              : `${loci.length} of the genes we model can differ between kits from this pairing; each square below shows how one of them splits.`}
          </p>
          {loci.length > 0 && (
            <div className="flex flex-wrap gap-6">
              {loci.map((id) => (
                <PunnettSquare key={id} grid={punnett(id, dam, sire)} />
              ))}
            </div>
          )}
          <section>
            <h3 className="text-xl font-bold tracking-tight">Reading the squares</h3>
            <p className="mt-1 max-w-[44rem] text-ink-soft">
              Rows are the doe&rsquo;s two copies of a gene, columns the buck&rsquo;s. Each of the four cells is one
              equally likely kit, so a pair that fills two cells turns up in about half the litter. Multiply the
              chances across genes to get each look&rsquo;s odds.
            </p>
          </section>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={onOpenLearn} className="btn-block btn-forest">
              Open the Learn primer
            </button>
            <button type="button" onClick={onOpenCitations} className="btn-block btn-outline text-ink">
              Sources and citations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
