import { InfoPage } from './InfoPage';

interface AboutPageProps {
  onBack: () => void;
}

export function AboutPage({ onBack }: AboutPageProps) {
  return (
    <InfoPage title="How This App Works" onBack={onBack}>
      <p>
        The <strong>Leporidae Genetics Architecture Engine</strong> is an interactive tool for
        exploring meat-rabbit coat and eye color genetics. It helps you understand which genes
        influence color, where they sit on the rabbit genome, and how common commercial varieties
        (New Zealand White, Californian, New Zealand Red, etc.) are built genetically.
      </p>

      <h2>What you can do today</h2>
      <ul>
        <li>
          <strong>Select a locus</strong> — Click any card in the Loci Matrix (A, B, C, D, E, En,
          V) to focus that gene. The 3D canvas highlights the chromosome where that gene is
          anchored in the reference genome.
        </li>
        <li>
          <strong>Explore the 3D canvas</strong> — Drag to orbit, scroll or pinch to zoom. Hover
          chromosomes to highlight them. Mapped chromosomes currently shown: 1 (TYR, TYRP1), 4
          (ASIP), and 15 (KIT).
        </li>
        <li>
          <strong>Review eye color rules</strong> — Ruby-eyed white (REW), blue-eyed white (BEW),
          Himalayan pink eyes, and normal dark eyes are explained separately because they involve
          different loci (especially C vs V).
        </li>
        <li>
          <strong>Compare meat-rabbit varieties</strong> — Typical genotype summaries for common
          commercial color types appear in the left panel reference cards.
        </li>
        <li>
          <strong>Toggle light / dark mode</strong> — Sun/moon control in the header; your choice
          is remembered across visits.
        </li>
      </ul>

      <h2>What&apos;s coming next</h2>
      <ul>
        <li>Parent genotype selectors for each locus</li>
        <li>Punnett square cross engine with epistasis (e.g. cc albino masking coat color)</li>
        <li>Cross results panel with phenotype probabilities</li>
        <li>Offline PWA support</li>
      </ul>

      <h2>How the layout works</h2>
      <p>
        On desktop, the left panel (loci, eye color, references) and right panel (3D canvas) scroll
        independently so a long genetics list doesn&apos;t stretch the canvas into oblivion. On
        mobile, the page stacks vertically and scrolls as one column.
      </p>

      <h2>Division of labor</h2>
      <p>
        This app separates <em>scaffolding</em> from <em>biology</em>. The structure, UI, 3D
        workspace, and data wiring are built here. Accurate epistasis rules, allele verification
        against your herd, and visual polish on the 3D models are meant to be reviewed and refined
        by a human breeder — not blindly trusted from an AI summary.
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
