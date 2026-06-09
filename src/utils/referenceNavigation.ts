export const CHROMOSOME_EXPLORER_OPEN_EVENT = 'rabbit-chromosome-explorer-open';

export function openChromosomeExplorer(): void {
  window.dispatchEvent(new CustomEvent(CHROMOSOME_EXPLORER_OPEN_EVENT));
}
