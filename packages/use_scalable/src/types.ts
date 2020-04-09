export type Point = number[];

export type Dimensions = [number, number];

export type Distance = number[];
export type Vector = number[];

export interface UseScalableOptions {
  initialScale?: Vector;
  min?: Vector;
  max?: Vector;
  height?: number;
  width?: number;
  top?: number;
  left?: number;
}

export interface UseScalableState {
  vector: Vector;
  distance: Distance;
}

export type UseScalableHandler = (point: Point, center?: Point) => void;

export interface UseScalableHandlers {
  start: UseScalableHandler;
  move: UseScalableHandler;
  end(): void;
}

export type UseScalableReturn = [UseScalableState, UseScalableHandlers];
