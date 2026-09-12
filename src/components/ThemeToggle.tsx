import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../store/useThemeStore';

export function ThemeToggle() {
  const { theme, setTheme, isDark } = useTheme();

  return (
    <div
      className="inline-flex items-center rounded-full border border-rule dark:border-rule-dark bg-paper/80 dark:bg-paper-2/90 p-0.5 shadow-paper-sm"
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
            ? 'bg-paper-soft text-teal shadow-sm'
            : 'text-slate-400 hover:text-ink'
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
            ? 'bg-espresso text-teal shadow-sm ring-1 ring-rule-dark'
            : 'text-ink-muted hover:text-ink'
        }`}
      >
        <Moon className="h-4 w-4" strokeWidth={2.25} />
      </button>

      <span className="sr-only">Current theme: {theme}</span>
    </div>
  );
}
