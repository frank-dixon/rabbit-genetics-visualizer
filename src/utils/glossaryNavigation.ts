import { GLOSSARY_SECTIONS } from '../data/glossary';

export const GLOSSARY_OPEN_EVENT = 'rabbit-glossary-open';

export function glossaryEntryAnchor(sectionId: string, term: string): string {
  const slug = term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `glossary-${sectionId}-${slug}`;
}

export interface GlossaryLinkPhrase {
  phrase: string;
  anchor: string;
}

const EXTRA_GLOSSARY_PHRASES: GlossaryLinkPhrase[] = [
  { phrase: 'Ruby-Eyed White', anchor: glossaryEntryAnchor('patterns', 'Ruby-Eyed White (REW)') },
  { phrase: 'REW', anchor: glossaryEntryAnchor('patterns', 'Ruby-Eyed White (REW)') },
  { phrase: 'Blue-Eyed White', anchor: glossaryEntryAnchor('patterns', 'Blue-Eyed White (BEW)') },
  { phrase: 'BEW', anchor: glossaryEntryAnchor('patterns', 'Blue-Eyed White (BEW)') },
  { phrase: 'Self black', anchor: glossaryEntryAnchor('patterns', 'Self / solid (aa)') },
  { phrase: 'ch/c', anchor: glossaryEntryAnchor('patterns', 'Himalayan / pointed white (ch_)') },
  { phrase: 'chch', anchor: glossaryEntryAnchor('patterns', 'Himalayan / pointed white (ch_)') },
  { phrase: 'Sisi', anchor: glossaryEntryAnchor('patterns', 'Silvering (sisi / Sisi)') },
  { phrase: 'sisi', anchor: glossaryEntryAnchor('patterns', 'Silvering (sisi / Sisi)') },
  { phrase: 'Enen', anchor: glossaryEntryAnchor('locus-en', 'En (spotting)') },
  { phrase: 'Crème d\'Argent', anchor: glossaryEntryAnchor('breeds', 'd\'Argent') },
];

function buildGlossaryLinkPhrases(): GlossaryLinkPhrase[] {
  const phrases: GlossaryLinkPhrase[] = [];

  for (const section of GLOSSARY_SECTIONS) {
    for (const entry of section.entries) {
      phrases.push({
        phrase: entry.term,
        anchor: glossaryEntryAnchor(section.id, entry.term),
      });
    }
  }

  phrases.push(...EXTRA_GLOSSARY_PHRASES);

  return [...phrases].sort((a, b) => b.phrase.length - a.phrase.length);
}

export const GLOSSARY_LINK_PHRASES = buildGlossaryLinkPhrases();

export function openGlossaryTerm(anchorId: string): void {
  window.dispatchEvent(
    new CustomEvent(GLOSSARY_OPEN_EVENT, { detail: { anchorId } }),
  );
}

export interface TextSegment {
  type: 'text' | 'term';
  value: string;
  anchor?: string;
}

export function splitTextWithGlossaryTerms(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    let matched: GlossaryLinkPhrase | null = null;
    let matchIndex = -1;

    for (const link of GLOSSARY_LINK_PHRASES) {
      const index = text.indexOf(link.phrase, cursor);
      if (index === -1) continue;
      if (matched === null || index < matchIndex) {
        matched = link;
        matchIndex = index;
      }
    }

    if (!matched || matchIndex === -1) {
      segments.push({ type: 'text', value: text.slice(cursor) });
      break;
    }

    if (matchIndex > cursor) {
      segments.push({ type: 'text', value: text.slice(cursor, matchIndex) });
    }

    segments.push({
      type: 'term',
      value: matched.phrase,
      anchor: matched.anchor,
    });

    cursor = matchIndex + matched.phrase.length;
  }

  return segments.filter((segment) => segment.value.length > 0);
}

export function filterGlossarySections(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return GLOSSARY_SECTIONS;

  return GLOSSARY_SECTIONS.map((section) => ({
    ...section,
    entries: section.entries.filter(
      (entry) =>
        entry.term.toLowerCase().includes(normalized) ||
        entry.definition.toLowerCase().includes(normalized) ||
        section.title.toLowerCase().includes(normalized),
    ),
  })).filter((section) => section.entries.length > 0);
}
