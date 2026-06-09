import { useEffect, useRef } from 'react';
import { useGeneticStore } from '../store/useGeneticStore';
import { parseCrossFromSearch } from '../utils/genotypeCodec';

/**
 * Applies share-link URL params after persisted state rehydrates (URL wins over localStorage).
 */
export function CrossHydrator() {
  const loadCrossSnapshot = useGeneticStore((state) => state.loadCrossSnapshot);
  const appliedRef = useRef(false);

  useEffect(() => {
    const applyShareUrl = () => {
      if (appliedRef.current) return;

      const snapshot = parseCrossFromSearch(window.location.search);
      if (!snapshot) return;

      appliedRef.current = true;
      loadCrossSnapshot(snapshot);
    };

    if (useGeneticStore.persist.hasHydrated()) {
      applyShareUrl();
      return;
    }

    return useGeneticStore.persist.onFinishHydration(() => {
      applyShareUrl();
    });
  }, [loadCrossSnapshot]);

  return null;
}
