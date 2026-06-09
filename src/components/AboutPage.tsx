import { APP_NAME, APP_TAGLINE } from '../constants/app';
import { InfoPage } from './InfoPage';

interface AboutPageProps {
  onBack: () => void;
}

export function AboutPage({ onBack }: AboutPageProps) {
  return (
    <InfoPage title="How This App Works" onBack={onBack}>
      <p>
        <strong>{APP_NAME}</strong> is a {APP_TAGLINE.toLowerCase()}. Pick two parent rabbits,
        load variety presets (New Zealand White, Californian, Silver Fox, d&apos;Argent breeds, and
        more), and see predicted progeny coat colors, eye colors, patterns, and silvering — with
        probabilities for each outcome.
      </p>

      <h2>What you can do today</h2>
      <ul>
        <li>
          <strong>Set your cross</strong> — Parent A and Parent B cards show a searchable preset
          picker, technical phenotype, plain-English description, compact genotype, and a coat
          preview. Swap parents with a text link between the cards.
        </li>
        <li>
          <strong>Scan progeny outcomes</strong> — Grouped results show combined probability,
          plain-English summary, technical labels, thumbnails, and per-variant genotypes with
          differing loci highlighted.
        </li>
        <li>
          <strong>Edit alleles per parent</strong> — Expand &quot;Edit genotype&quot; inside each
          parent card for per-locus control. Open &quot;Variety notes&quot; for cross-breeding
          context on each breed.
        </li>
        <li>
          <strong>Copy and share</strong> — Copy any genotype string from parent or progeny rows.
          Use &quot;Copy share link&quot; in the cross header to save or send the full cross via
          URL. Your cross also persists automatically in this browser.
        </li>
        <li>
          <strong>Dig into genetics</strong> — Collapsible reference sections cover the loci matrix,
          eye color rules, 3D chromosome explorer, and a full glossary.
        </li>
        <li>
          <strong>Install for offline use</strong> — Production builds register a service worker for
          add-to-home-screen use.
        </li>
        <li>
          <strong>Toggle light / dark mode</strong> — Sun/moon control in the header; your choice is
          remembered across visits.
        </li>
      </ul>

      <h2>What&apos;s coming next</h2>
      <ul>
        <li>Biology review — epistasis rules and phenotype naming in the cross engine</li>
        <li>Richer coat previews — banding, finer broken patterns, reference photos per breed</li>
        <li>Final branded icon artwork</li>
      </ul>

      <h2>Progeny predictions</h2>
      <p>
        The cross engine calculates Mendelian offspring probabilities from parent genotypes.
        Illustrative previews are procedural SVGs — draft genetics, not show-standard artwork.
        Epistasis rules (especially <strong>cc</strong> albino and <strong>vv</strong> Vienna) need
        human verification before breeding decisions.
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
