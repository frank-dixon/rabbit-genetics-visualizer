interface GenotypeButtonPickerProps {
  label: string;
  value: string;
  options: readonly [string, string, string];
  onChange: (value: string) => void;
}

export function GenotypeButtonPicker({
  label,
  value,
  options,
  onChange,
}: GenotypeButtonPickerProps) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <div className="flex gap-1 justify-center">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`min-w-[2.5rem] px-2 py-1 rounded-md font-mono text-xs font-semibold border transition ${
              value === option
                ? 'bg-sky-100 dark:bg-sky-950/60 border-sky-400 dark:border-sky-600 text-sky-800 dark:text-sky-300'
                : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-sky-300 dark:hover:border-sky-600'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
