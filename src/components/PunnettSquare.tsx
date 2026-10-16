import type { PunnettGrid } from '../utils/litterCopy';
import { samePair } from '../utils/litterCopy';

interface PunnettSquareProps {
  grid: PunnettGrid;
  /** Highlight cells equal to this pair (e.g. the outcome's genotype at this locus). */
  highlight?: [string, string];
}

/** One locus: rows are the doe's two copies, columns the buck's. */
export function PunnettSquare({ grid, highlight }: PunnettSquareProps) {
  const { locusId, locusName, damAlleles, sireAlleles, cells } = grid;
  return (
    <figure className="m-0">
      <figcaption className="font-mono text-[11px] text-ink-muted">
        {locusId} · {locusName} · doe {damAlleles.join('')} × buck {sireAlleles.join('')}
      </figcaption>
      <table className="mt-1.5 border-collapse font-mono text-sm">
        <thead>
          <tr>
            <th className="h-9 w-12 border border-rule bg-paper-2" aria-label="doe and buck alleles" />
            {sireAlleles.map((a, i) => (
              <th key={i} scope="col" className="h-9 w-12 border border-rule bg-paper-2 font-medium">
                {a}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cells.map((row, r) => (
            <tr key={r}>
              <th scope="row" className="h-9 w-12 border border-rule bg-paper-2 font-medium">
                {damAlleles[r]}
              </th>
              {row.map((pair, c) => {
                const hit = highlight ? samePair(locusId, pair, highlight) : false;
                return (
                  <td
                    key={c}
                    className={`h-9 w-12 border border-rule text-center ${hit ? 'bg-[var(--moss)] font-semibold text-[var(--paper)]' : 'bg-paper text-ink'}`}
                  >
                    {pair.join('')}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
