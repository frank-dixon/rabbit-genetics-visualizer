import { PARENT_PRESETS } from '../data/meatRabbitBreeds';
import { useGeneticStore } from '../store/useGeneticStore';

const EXAMPLE_CROSSES = [
  {
    label: "NZ White (field) × Crème d'Argent",
    parent1PresetId: 'nz-white-field',
    parent2PresetId: 'creme-dargent',
  },
  {
    label: 'Californian × NZ White (show)',
    parent1PresetId: 'californian',
    parent2PresetId: 'nz-white-show',
  },
  {
    label: 'NZ Red × NZ Black',
    parent1PresetId: 'nz-red',
    parent2PresetId: 'nz-black',
  },
] as const;

export function ExampleCrossChips() {
  const parent1PresetId = useGeneticStore((state) => state.parent1PresetId);
  const parent2PresetId = useGeneticStore((state) => state.parent2PresetId);
  const loadParentPreset = useGeneticStore((state) => state.loadParentPreset);

  if (parent1PresetId && parent2PresetId) {
    return null;
  }

  const loadExample = (example: (typeof EXAMPLE_CROSSES)[number]) => {
    const preset1 = PARENT_PRESETS.find((entry) => entry.id === example.parent1PresetId);
    const preset2 = PARENT_PRESETS.find((entry) => entry.id === example.parent2PresetId);
    if (preset1) {
      loadParentPreset('parent1', preset1.id, preset1.genotype);
    }
    if (preset2) {
      loadParentPreset('parent2', preset2.id, preset2.genotype);
    }
  };

  return (
    <div className="rounded-lg border border-dashed border-sky-300 dark:border-sky-700 bg-sky-50/50 dark:bg-sky-950/20 p-3 space-y-2">
      <p className="text-xs font-semibold text-sky-900 dark:text-sky-200">Try an example cross</p>
      <p className="text-[10px] text-slate-600 dark:text-slate-400">
        Pick a preset pairing to see how progeny predictions work.
      </p>
      <div className="flex flex-wrap gap-2">
        {EXAMPLE_CROSSES.map((example) => (
          <button
            key={example.label}
            type="button"
            onClick={() => loadExample(example)}
            className="text-[10px] rounded-full border border-sky-300 dark:border-sky-700 bg-white dark:bg-slate-900 text-sky-800 dark:text-sky-200 px-3 py-1.5 hover:bg-sky-100 dark:hover:bg-sky-950/60 transition"
          >
            {example.label}
          </button>
        ))}
      </div>
    </div>
  );
}
