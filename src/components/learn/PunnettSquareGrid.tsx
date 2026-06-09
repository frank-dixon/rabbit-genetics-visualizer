import type { ReactNode } from 'react';
import type { PunnettSquareResult } from '../../utils/punnettSquare';
import { formatProbability } from '../../utils/geneticEngine';

interface PunnettSquareGridProps {
  square: PunnettSquareResult;
  parent1Label: string;
  parent2Label: string;
  highlight?: { row: number; col: number } | null;
  onHighlight?: (position: { row: number; col: number } | null) => void;
}

const CELL = 'w-[5.25rem]';
const CELL_H = 'h-[4.25rem]';

function GameteBadge({
  gamete,
  active,
  tall = false,
}: {
  gamete: string;
  active: boolean;
  tall?: boolean;
}) {
  return (
    <div
      className={`${CELL} ${tall ? CELL_H : 'h-8'} rounded-lg font-mono text-sm font-bold border flex items-center justify-center transition-colors ${
        active
          ? 'bg-indigo-100 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-800 dark:text-indigo-200'
          : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
      }`}
    >
      {gamete}
    </div>
  );
}

function AxisLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500 text-center">
      {children}
    </p>
  );
}

export function PunnettSquareGrid({
  square,
  parent1Label,
  parent2Label,
  highlight = null,
  onHighlight,
}: PunnettSquareGridProps) {
  const { rowGametes, colGametes, cells } = square;

  return (
    <div className="mx-auto w-fit">
      <div className="flex gap-1.5">
        <div className={`${CELL} shrink-0`} aria-hidden="true" />
        <div className={`${CELL} shrink-0`} aria-hidden="true" />
        <div className="flex flex-col gap-1 items-center">
          <AxisLabel>{parent2Label}</AxisLabel>
          <div className="flex gap-1.5">
            {colGametes.map((gamete, colIndex) => (
              <GameteBadge
                key={`col-${gamete}-${colIndex}`}
                gamete={gamete}
                active={highlight?.col === colIndex}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-1.5 mt-1.5 items-center">
        <div className={`${CELL} shrink-0 flex items-center justify-center self-stretch`}>
          <AxisLabel>{parent1Label}</AxisLabel>
        </div>

        <div className="flex flex-col gap-1.5">
          {cells.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex gap-1.5">
              <GameteBadge
                gamete={rowGametes[rowIndex]}
                active={highlight?.row === rowIndex}
                tall
              />
              {row.map((cell, colIndex) => {
                const isActive =
                  highlight?.row === rowIndex && highlight?.col === colIndex;
                const isDimmed =
                  highlight !== null &&
                  highlight !== undefined &&
                  !isActive &&
                  (highlight.row === rowIndex || highlight.col === colIndex);

                return (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={`${CELL} ${CELL_H} rounded-lg border flex flex-col items-center justify-center gap-0.5 transition-all cursor-default ${
                      isActive
                        ? 'bg-sky-100 dark:bg-sky-950/50 border-sky-400 dark:border-sky-500 shadow-sm shadow-sky-200/50 dark:shadow-sky-900/30'
                        : isDimmed
                          ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                    onMouseEnter={() => onHighlight?.({ row: rowIndex, col: colIndex })}
                    onMouseLeave={() => onHighlight?.(null)}
                    onFocus={() => onHighlight?.({ row: rowIndex, col: colIndex })}
                    onBlur={() => onHighlight?.(null)}
                    tabIndex={0}
                  >
                    <span className="font-mono text-base font-bold text-slate-800 dark:text-slate-100 leading-none">
                      {cell.label}
                    </span>
                    <span className="text-[10px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                      {formatProbability(cell.probability)}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
