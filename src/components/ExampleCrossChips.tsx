import { PARENT_PRESETS } from '../data/meatRabbitBreeds';
import { useGeneticStore } from '../store/useGeneticStore';

const EXAMPLE_CROSSES = [
  {
    label: "NZ White × Crème",
    parent1PresetId: 'nz-white-field',
    parent2PresetId: 'creme-dargent',
  },
  {
    label: 'Californian × NZ show',
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
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 shrink-0">
        Examples
      </span>
      {EXAMPLE_CROSSES.map((example) => (
        <button
          key={example.label}
          type="button"
          onClick={() => loadExample(example)}
          className="text-[10px] rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-2.5 py-1 hover:border-sky-300 dark:hover:border-sky-600 hover:text-sky-800 dark:hover:text-sky-300 transition"
        >
          {example.label}
        </button>
      ))}
    </div>
  );
}
