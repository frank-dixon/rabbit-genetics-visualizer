import { splitTextWithGlossaryTerms, openGlossaryTerm } from '../utils/glossaryNavigation';

interface GlossaryTermTextProps {
  text: string;
  className?: string;
}

export function GlossaryTermText({ text, className = '' }: GlossaryTermTextProps) {
  const segments = splitTextWithGlossaryTerms(text);

  return (
    <span className={className}>
      {segments.map((segment, index) =>
        segment.type === 'term' && segment.anchor ? (
          <button
            key={`${segment.anchor}-${index}`}
            type="button"
            onClick={() => openGlossaryTerm(segment.anchor!)}
            className="text-sky-700 dark:text-sky-400 hover:underline font-inherit inline p-0 border-0 bg-transparent cursor-pointer"
          >
            {segment.value}
          </button>
        ) : (
          <span key={`text-${index}`}>{segment.value}</span>
        ),
      )}
    </span>
  );
}
