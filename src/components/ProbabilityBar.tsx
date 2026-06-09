interface ProbabilityBarProps {
  value: number;
  max?: number;
  className?: string;
}

export function ProbabilityBar({ value, max = 1, className = '' }: ProbabilityBarProps) {
  const widthPercent = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  return (
    <div
      className={`h-1.5 w-full min-w-[3rem] max-w-[4.5rem] rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div
        className="h-full rounded-full bg-sky-500 dark:bg-sky-400 transition-all duration-300"
        style={{ width: `${widthPercent}%` }}
      />
    </div>
  );
}
