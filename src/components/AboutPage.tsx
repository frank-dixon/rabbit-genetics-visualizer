import { APP_NAME, APP_TAGLINE } from '../constants/app';
import { InfoPage } from './InfoPage';

interface AboutPageProps {
  onBack: () => void;
}

export function AboutPage({ onBack }: AboutPageProps) {
  return (
    <InfoPage title="How It Works" onBack={onBack}>
      <p>
        <strong>{APP_NAME}</strong> is a {APP_TAGLINE.toLowerCase()}. Pick two parent rabbits,
        load variety presets (New Zealand White, Californian, Silver Fox, d&apos;Argent breeds, and
        more), and see predicted progeny coat colors, eye colors, patterns, and silvering — with
        probabilities for each outcome.
      </p>

      <h2>What you can do</h2>
      <ul>
        <li>
          <strong>Set your cross</strong> — Choose a preset for the dam and sire, or start from a
          custom genotype. Each card shows the phenotype, a plain-English description, the compact
          genotype, and a coat preview.
        </li>
        <li>
          <strong>Scan progeny outcomes</strong> — Results are grouped by look, with the combined
          probability and every genotype that produces it. Loci that differ between variants are
          highlighted.
        </li>
        <li>
          <strong>Edit alleles per parent</strong> — Open &quot;Genetics &amp; editing&quot; on a
          parent card for per-locus control and cross-breeding notes for the chosen breed.
        </li>
        <li>
          <strong>Save and share</strong> — Copy any genotype string, save pairings you repeat, or
          use Share to send the full cross as a link. Your current cross is remembered in this
          browser.
        </li>
        <li>
          <strong>Dig into genetics</strong> — The reference sections cover the loci matrix, eye
          color rules, a 3D chromosome explorer, and a full glossary.
        </li>
        <li>
          <strong>Use it in the barn</strong> — Add it to your home screen and it keeps working
          offline.
        </li>
      </ul>

      <h2>Progeny predictions</h2>
      <p>
        The cross engine calculates Mendelian offspring probabilities from parent genotypes. Coat
        previews are illustrations, not show-standard artwork. Interactions between loci
        (especially <strong>cc</strong> albino and <strong>vv</strong> Vienna masking other colors)
        are simplified, so confirm them against your own stock.
      </p>

      <h2>Important disclaimer</h2>
      <p>
        Genetics data is drawn from published sources (OSU Extension, OMIA, peer-reviewed
        studies). Rabbit color genetics has incomplete dominance at several loci, modifier genes,
        and breed-specific quirks. Use this tool for planning and learning — not as the sole basis
        for commercial breeding decisions.
      </p>
    </InfoPage>
  );
}
