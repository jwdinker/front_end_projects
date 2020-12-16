export interface Measurements {
  size: number;
  offset: number;
}

export type SetItemSize = (index: number) => number;

export type OnMeasure = (index: number, measurements: Measurements) => void;

export type OnReset = (range: IndexRange) => void;

interface CachedMeasurement {
  [key: number]: {
    offset: number;
    size: number;
  };
}

export interface MeasurementIndexerState {
  indexed: Indexed;
  cache: CachedMeasurement;
}

export type OffsetGetter = (index: number) => number;

export type IndexRange = [number, number];

export type Boundaries = [number, number];

export type Indexed = number[];

export type ItemSize = number | SetItemSize;

export type GetMeasurements = (index: number) => Measurements;

export interface MeasurementsIndexerProps {
  itemSize: ItemSize;
  estimatedItemSize?: number;
  boundaries?: Boundaries;
  infinite?: boolean;
  onMeasure?: OnMeasure;
  onReset?: (range: IndexRange) => void;
  onClear?: () => void;
}
