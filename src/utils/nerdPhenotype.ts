import { LOCI_ORDER, RABBIT_GENETIC_MAP } from '../data/rabbitGenetics';

type GenotypeMap = Record<string, [string, string]>;

function alleleMeta(locusId: string, code: string) {
  const locus = RABBIT_GENETIC_MAP[locusId];
  return locus?.alleles.find((allele) => allele.code === code);
}

function formatPair(locusId: string, pair: [string, string]): string {
  const a = alleleMeta(locusId, pair[0])?.symbol ?? pair[0];
  const b = alleleMeta(locusId, pair[1])?.symbol ?? pair[1];
  return `${a}/${b}`;
}

function resolvedAllele(locusId: string, pair: [string, string]): string {
  const hierarchy = RABBIT_GENETIC_MAP[locusId]?.dominanceHierarchy ?? [];
  const ranked = [...pair].sort((left, right) => hierarchy.indexOf(left) - hierarchy.indexOf(right));
  return ranked[0] ?? pair[0];
}

function alleleBlurb(locusId: string, code: string): string {
  const allele = alleleMeta(locusId, code);
  if (!allele) return code;
  return `${allele.symbol} (${allele.name}): ${allele.description}`;
}

/**
 * Dense locus-by-locus explanation for Nerd mode cards.
 * Keep this out of Simple mode — Simple uses plainEnglishPhenotype only.
 */
export function resolveNerdPhenotypeDetail(genotypes: GenotypeMap): {
  summary: string;
  loci: { id: string; label: string; genotype: string; expressed: string; detail: string }[];
  interactions: string[];
} {
  const loci = LOCI_ORDER.filter((id) => genotypes[id]).map((id) => {
    const locus = RABBIT_GENETIC_MAP[id];
    const pair = genotypes[id];
    const expressed = resolvedAllele(id, pair);
    const expressedMeta = alleleMeta(id, expressed);
    const same = pair[0] === pair[1];

    const detailParts = [
      `${locus?.name ?? id} (${locus?.geneSymbol ?? id}) — ${locus?.function ?? ''}`,
      same
        ? `Homozygous ${formatPair(id, pair)}.`
        : `Heterozygous ${formatPair(id, pair)}; expressed allele is ${expressedMeta?.symbol ?? expressed} by dominance hierarchy ${locus?.dominanceHierarchy.join(' > ') ?? ''}.`,
      alleleBlurb(id, pair[0]),
    ];

    if (!same) {
      detailParts.push(alleleBlurb(id, pair[1]));
    }

    if (locus?.notes) {
      detailParts.push(locus.notes);
    }

    return {
      id,
      label: locus?.name ?? id,
      genotype: formatPair(id, pair),
      expressed: expressedMeta?.symbol ?? expressed,
      detail: detailParts.filter(Boolean).join(' '),
    };
  });

  const interactions: string[] = [];
  const c = genotypes.C;
  const v = genotypes.V;
  const a = genotypes.A ? resolvedAllele('A', genotypes.A) : null;
  const e = genotypes.E ? resolvedAllele('E', genotypes.E) : null;
  const d = genotypes.D;
  const en = genotypes.En;
  const si = genotypes.Si;

  if (c && c[0] === 'c' && c[1] === 'c') {
    interactions.push(
      'C locus cc (albino) epistatically blocks coat pigment — phenotype is white with ruby eyes regardless of A/B/D/E color genotype.',
    );
  } else if (v && v[0] === 'v' && v[1] === 'v') {
    interactions.push(
      'V locus vv (Vienna) produces blue-eyed white; coat pigment pathways are overridden for a solid white look.',
    );
  } else {
    if (c && (c[0] === 'ch' || c[1] === 'ch') && resolvedAllele('C', c) === 'ch') {
      interactions.push(
        'C locus Himalayan (ch) restricts pigment to cooler extremities — body stays pale while points darken.',
      );
    }
    if (a === 'a' && e === 'e') {
      interactions.push(
        'Self (aa) plus non-extension (ee) removes agouti banding and favors cream/fawn/red self tones depending on dilution.',
      );
    }
    if (a === 'A' && e === 'Es') {
      interactions.push(
        'Agouti (A_) with steel (Es) tips guard hairs silver/gold over the banded coat.',
      );
    }
    if (d && d[0] === 'd' && d[1] === 'd') {
      interactions.push(
        'Dilute dd softens eumelanin and phaeomelanin density (black→blue, chocolate→lilac, red→cream).',
      );
    }
    if (en && ((en[0] === 'En' && en[1] === 'en') || (en[0] === 'en' && en[1] === 'En'))) {
      interactions.push(
        'English spotting En/en yields broken colored patches on white; En/En is Charlie (mostly white).',
      );
    }
    if (si && (si[0] === 'si' || si[1] === 'si')) {
      interactions.push(
        'Silver (si) adds progressive silver ticking as the coat matures; homozygous si/si is heavier than heterozygous.',
      );
    }
  }

  const summary = loci
    .map((entry) => `${entry.id}:${entry.genotype}`)
    .join(' · ');

  return { summary, loci, interactions };
}

export function resolveNerdPhenotypeBlurb(genotypes: GenotypeMap): string {
  const { interactions, loci } = resolveNerdPhenotypeDetail(genotypes);
  const top = interactions[0];
  const locusLine = loci
    .slice(0, 4)
    .map((entry) => `${entry.id} ${entry.genotype}→${entry.expressed}`)
    .join('; ');
  if (top) {
    return `${top} Key loci: ${locusLine}${loci.length > 4 ? '…' : ''}.`;
  }
  return `Expressed alleles — ${locusLine}${loci.length > 4 ? '…' : ''}.`;
}
