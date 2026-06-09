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
          <strong>Set your cross</strong> — Parent A and Parent B cards show preset, phenotype,
          compact genotype, and a small coat preview. Swap parents with one tap.
        </li>
        <li>
          <strong>Scan progeny outcomes</strong> — A compact scrollable list shows probability,
          phenotype, and a thumbnail per outcome. Tap a row for full genotype.
        </li>
        <li>
          <strong>Edit alleles</strong> — Expand &quot;Edit genotypes&quot; when you need per-locus
          control. Presets and variety labels persist above.
        </li>
        <li>
          <strong>Dig into genetics</strong> — Collapsible reference sections cover the loci matrix,
          eye color rules, meat-rabbit variety library, and a 3D chromosome explorer.
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
