export type Remeasure = () => void;

export interface Dimensions {
  height: number;
  width: number;
}

export type UseDimensionsListReturn = [Dimensions[], Remeasure];
