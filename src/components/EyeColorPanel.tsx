import { EYE_COLOR_RULES, MEAT_RABBIT_VARIETIES } from '../data/rabbitGenetics';

export function EyeColorPanel() {
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold border-b border-slate-200 dark:border-slate-800 pb-2 text-slate-700 dark:text-slate-200">
          Eye Color Genetics
        </h2>
        <ul className="mt-4 space-y-3">
          {EYE_COLOR_RULES.map((rule) => (
            <li
              key={rule.id}
              className="text-xs border border-slate-200 dark:border-slate-800 rounded-lg p-3 bg-slate-50 dark:bg-slate-950/50"
            >
              <div className="font-semibold text-sky-700 dark:text-sky-400">{rule.name}</div>
              <div className="font-mono text-slate-600 dark:text-slate-300 mt-1">
                {rule.genotypeSummary}
              </div>
              <div className="text-slate-600 dark:text-slate-400 mt-1">{rule.eyeAppearance}</div>
              {rule.meatRabbitExample && (
                <div className="text-slate-500 dark:text-slate-500 mt-1 italic">
                  e.g. {rule.meatRabbitExample}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold border-b border-slate-200 dark:border-slate-800 pb-2 text-slate-700 dark:text-slate-200">
          Common Meat-Rabbit Varieties
        </h2>
        <ul className="mt-4 space-y-3">
          {MEAT_RABBIT_VARIETIES.map((variety) => (
            <li
              key={variety.name}
              className="text-xs border border-slate-200 dark:border-slate-800 rounded-lg p-3 bg-slate-50 dark:bg-slate-950/50"
            >
              <div className="font-semibold text-slate-700 dark:text-slate-200">{variety.name}</div>
              <div className="font-mono text-slate-500 dark:text-slate-400 mt-1">
                {variety.typicalGenotypeSummary}
              </div>
              <div className="text-slate-600 dark:text-slate-400 mt-1">{variety.coatDescription}</div>
              <div className="text-sky-700 dark:text-sky-400 mt-1">Eyes: {variety.eyeColor}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
