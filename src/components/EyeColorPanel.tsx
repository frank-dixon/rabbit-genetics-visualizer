import { EYE_COLOR_RULES } from '../data/rabbitGenetics';
import {
  MEAT_RABBIT_CATEGORIES,
  MEAT_RABBIT_VARIETIES,
} from '../data/meatRabbitBreeds';
import { CollapsiblePanel, CollapsibleSection } from './CollapsibleSection';

export function EyeColorPanel() {
  return (
    <div className="space-y-4">
      <CollapsiblePanel title="Eye Color Genetics" defaultOpen={false}>
        {EYE_COLOR_RULES.map((rule) => (
          <CollapsibleSection
            key={rule.id}
            defaultOpen={false}
            title={
              <div className="font-semibold text-sm text-sky-700 dark:text-sky-400">{rule.name}</div>
            }
            subtitle={rule.genotypeSummary}
          >
            <div className="text-xs space-y-2">
              <div className="font-mono text-slate-600 dark:text-slate-300">{rule.genotypeSummary}</div>
              <div className="text-slate-600 dark:text-slate-400">{rule.eyeAppearance}</div>
              <div className="text-slate-600 dark:text-slate-400">{rule.mechanism}</div>
              {rule.meatRabbitExample && (
                <div className="text-slate-500 italic">e.g. {rule.meatRabbitExample}</div>
              )}
            </div>
          </CollapsibleSection>
        ))}
      </CollapsiblePanel>

      <CollapsiblePanel
        title="Common Meat-Rabbit Varieties"
        description={`${MEAT_RABBIT_VARIETIES.length} breeds and color varieties — draft genotypes, verify before breeding.`}
        defaultOpen={false}
      >
        {MEAT_RABBIT_CATEGORIES.map((category) => {
          const varieties = MEAT_RABBIT_VARIETIES.filter((v) => v.category === category);
          if (varieties.length === 0) return null;

          return (
            <div key={category} className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 px-1 pt-2 first:pt-0">
                {category}
              </h3>
              {varieties.map((variety) => (
                <CollapsibleSection
                  key={variety.name}
                  defaultOpen={false}
                  title={
                    <div className="font-semibold text-sm text-slate-700 dark:text-slate-200">
                      {variety.name}
                    </div>
                  }
                  subtitle={variety.typicalGenotypeSummary}
                >
                  <div className="text-xs space-y-2">
                    <div className="font-mono text-slate-500 dark:text-slate-400">
                      {variety.typicalGenotypeSummary}
                    </div>
                    <div className="text-slate-600 dark:text-slate-400">{variety.coatDescription}</div>
                    <div className="text-sky-700 dark:text-sky-400">Eyes: {variety.eyeColor}</div>
                  </div>
                </CollapsibleSection>
              ))}
            </div>
          );
        })}
      </CollapsiblePanel>
    </div>
  );
}
