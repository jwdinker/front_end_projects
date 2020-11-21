export interface Measurements {
  size: number;
  offset: number;
}

export type SetItemSize = (index: number, previousItemOffset: number) => number;

export type OnMeasure = (index: number, measurements: Measurements) => void;

export interface UseMeasurementsIndexerProps {
  itemSize?: number | SetItemSize;
  estimatedItemSize?: number;
  onMeasure?: OnMeasure;
  numberOfItems?: number;
  log?: boolean;
}

export type IndexRange = [number, number];
