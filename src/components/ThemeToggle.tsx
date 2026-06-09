import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../store/useThemeStore';

export function ThemeToggle() {
  const { theme, setTheme, isDark } = useTheme();

  return (
    <div
      className="inline-flex items-center rounded-full border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 p-0.5 shadow-sm"
      role="group"
      aria-label="Theme"
    >
      <button
        type="button"
        onClick={() => setTheme('light')}
        aria-pressed={!isDark}
        aria-label="Light mode"
        className={`relative flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 ${
          !isDark
            ? 'bg-white text-amber-500 shadow-sm dark:bg-slate-700'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Sun className="h-4 w-4" strokeWidth={2.25} />
      </button>

      <button
        type="button"
        onClick={() => setTheme('dark')}
        aria-pressed={isDark}
        aria-label="Dark mode"
        className={`relative flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 ${
          isDark
            ? 'bg-slate-900 text-sky-300 shadow-sm ring-1 ring-slate-600'
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Moon className="h-4 w-4" strokeWidth={2.25} />
      </button>

      <span className="sr-only">Current theme: {theme}</span>
    </div>
  );
}
