export type MeasureAtIndex = (index?: number) => void;

export interface Dimensions {
  height: number;
  width: number;
}

export type UseDimensionsListReturn = [Dimensions[], MeasureAtIndex];
