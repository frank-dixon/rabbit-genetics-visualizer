import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { PARENT_PRESET_CATEGORIES, PARENT_PRESETS } from '../data/meatRabbitBreeds';

interface PresetPickerProps {
  id: string;
  value: string | null;
  onChange: (presetId: string | null) => void;
}

function normalizeSearch(value: string): string {
  return value.trim().toLowerCase();
}

export function PresetPicker({ id, value, onChange }: PresetPickerProps) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selectedLabel = useMemo(() => {
    if (!value) return 'Custom';
    return PARENT_PRESETS.find((preset) => preset.id === value)?.label ?? 'Custom';
  }, [value]);

  const filteredCategories = useMemo(() => {
    const normalized = normalizeSearch(query);
    if (!normalized) {
      return PARENT_PRESET_CATEGORIES.map((category) => ({
        category,
        presets: PARENT_PRESETS.filter((preset) => preset.category === category),
      }));
    }

    return PARENT_PRESET_CATEGORIES.map((category) => ({
      category,
      presets: PARENT_PRESETS.filter(
        (preset) =>
          preset.category === category &&
          (preset.label.toLowerCase().includes(normalized) ||
            preset.category.toLowerCase().includes(normalized) ||
            preset.summary.toLowerCase().includes(normalized)),
      ),
    })).filter((group) => group.presets.length > 0);
  }, [query]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const selectPreset = (presetId: string | null) => {
    onChange(presetId);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        className="w-full flex items-center justify-between gap-2 text-xs rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 text-left"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 shadow-lg overflow-hidden">
          <div className="flex items-center gap-2 px-2 py-1.5 border-b border-slate-200 dark:border-slate-800">
            <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search breeds…"
              className="w-full text-xs bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <ul
            id={listboxId}
            role="listbox"
            className="max-h-52 overflow-y-auto overscroll-contain py-1"
          >
            <li role="option" aria-selected={value === null}>
              <button
                type="button"
                onClick={() => selectPreset(null)}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-900 ${
                  value === null
                    ? 'text-sky-700 dark:text-sky-400 font-medium'
                    : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                Custom
              </button>
            </li>

            {filteredCategories.map((group) => (
              <li key={group.category}>
                <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  {group.category}
                </div>
                <ul>
                  {group.presets.map((preset) => (
                    <li key={preset.id} role="option" aria-selected={value === preset.id}>
                      <button
                        type="button"
                        onClick={() => selectPreset(preset.id)}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-900 ${
                          value === preset.id
                            ? 'text-sky-700 dark:text-sky-400 font-medium'
                            : 'text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}

            {filteredCategories.length === 0 && (
              <li className="px-3 py-3 text-xs text-slate-500 dark:text-slate-400">
                No presets match &ldquo;{query}&rdquo;
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
