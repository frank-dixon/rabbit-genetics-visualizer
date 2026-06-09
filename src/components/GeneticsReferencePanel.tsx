import { useEffect, useState } from 'react';
import { ChromosomeCanvas } from './ChromosomeCanvas';
import { EyeColorPanel } from './EyeColorPanel';
import { LociMatrixPanel } from './LociMatrixPanel';
import { CollapsiblePanel } from './CollapsibleSection';
import { LOCI_ORDER, RABBIT_GENETIC_MAP } from '../data/rabbitGenetics';
import { useGeneticStore } from '../store/useGeneticStore';
import { CHROMOSOME_EXPLORER_OPEN_EVENT } from '../utils/referenceNavigation';

export function GeneticsReferencePanel() {
  const selectedLocusId = useGeneticStore((state) => state.selectedLocusId);
  const setSelectedLocus = useGeneticStore((state) => state.setSelectedLocus);
  const loci = LOCI_ORDER.map((id) => RABBIT_GENETIC_MAP[id]).filter(Boolean);
  const [chromosomeExplorerOpen, setChromosomeExplorerOpen] = useState(false);

  useEffect(() => {
    const handleOpenExplorer = () => setChromosomeExplorerOpen(true);
    window.addEventListener(CHROMOSOME_EXPLORER_OPEN_EVENT, handleOpenExplorer);
    return () => window.removeEventListener(CHROMOSOME_EXPLORER_OPEN_EVENT, handleOpenExplorer);
  }, []);

  return (
    <div className="space-y-4">
      <CollapsiblePanel
        title="Genetics Reference"
        description="Loci matrix, eye color rules, and meat-rabbit variety library — for deeper exploration."
        defaultOpen={false}
      >
        <div className="space-y-6">
          <LociMatrixPanel
            loci={loci}
            selectedLocusId={selectedLocusId}
            onSelectLocus={setSelectedLocus}
          />
          <EyeColorPanel />
        </div>
      </CollapsiblePanel>

      <CollapsiblePanel
        title="Chromosome Explorer"
        description="3D reference view — click a progeny outcome to highlight its loci here."
        open={chromosomeExplorerOpen}
        onOpenChange={setChromosomeExplorerOpen}
        defaultOpen={false}
      >
        <ChromosomeCanvas />
      </CollapsiblePanel>
    </div>
  );
}
