const HUB = 'https://frank-dixon.github.io';

const LINKS = [
  { href: `${HUB}/#about`, label: 'About' },
  { href: `${HUB}/#work`, label: 'Work' },
  { href: `${HUB}/#projects`, label: 'Projects' },
  { href: `${HUB}/#contact`, label: 'Contact' },
] as const;

/** Shared portfolio chrome linking back to frank-dixon.github.io (absolute URLs). */
export function HubMasthead() {
  return (
    <header className="hub-masthead shrink-0 sticky top-0 z-[60] border-b border-rule/80 dark:border-rule-dark/70 bg-paper/95 dark:bg-espresso/95 backdrop-blur-md">
      <div className="hub-nav mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-x-4 gap-y-2 px-3 py-[0.85rem] sm:px-4">
        <a
          className="hub-wordmark font-serif text-[1.15rem] font-semibold tracking-[-0.02em] text-ink no-underline dark:text-paper-soft"
          href={`${HUB}/`}
        >
          Frank Dixon<span className="text-teal">.</span>
        </a>
        <nav aria-label="Frank Dixon site">
          <ul className="m-0 flex list-none flex-wrap gap-x-[1.15rem] gap-y-[0.35rem] p-0">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-ink-muted no-underline hover:text-ink dark:text-slate-400 dark:hover:text-paper-soft"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
