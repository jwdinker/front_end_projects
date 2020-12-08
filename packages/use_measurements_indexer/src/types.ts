export interface Measurements {
  size: number;
  offset: number;
}

export type SetItemSize = (index: number, previousItemOffset: number) => number;

export type OnMeasure = (index: number, measurements: Measurements) => void;

interface CachedMeasurement {
  [key: number]: {
    offset: number;
    size: number;
  };
}

export type IndexRange = [number, number];

export interface UseMeasurementsIndexerProps {
  itemSize: number | SetItemSize;
  estimatedItemSize?: number;
  numberOfItems?: number;
  log?: boolean;
  onMeasure?: OnMeasure;
  onReset?: (range: IndexRange) => void;
  onClear?: () => void;
}

export interface MeasurementsIndexerProps {
  itemSize: number | SetItemSize;
  estimatedItemSize?: number;
  onMeasure?: OnMeasure;
  onReset?: (range: IndexRange) => void;
  onClear?: () => void;
  numberOfItems: number;
  log: boolean;
}

export interface MeasurementIndexerState {
  indexed: IndexRange;
  cache: CachedMeasurement;
}
