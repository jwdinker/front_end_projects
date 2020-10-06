export interface Measurements {
  size: number;
  offset: number;
}

export type SetItemSize = (index: number, previousItemOffset: number) => number;

export interface UseMeasurementsIndexerProps {
  itemSize?: number | SetItemSize;
  estimatedItemSize?: number;
  onMeasure?: (index: number, measurements: Measurements) => void;
  numberOfItems?: number;
  log?: boolean;
}

export type IndexRange = [number, number];
