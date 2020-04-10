export type Point = [number, number];

export type Dimensions = [number, number];

export type Distance = number[];
export type Vector = number[];

export interface UseScalableOptions {
  /**
   * The initial [x,y,z] scale values.
   */
  initialScale?: Vector;

  /**
   * Minimum scale for the x,y,z axis.
   */
  min?: Vector;

  /**
   * Maximum scale for the x,y,z axis.
   */
  max?: Vector;

  /**
   * Initial height of the element used in conjunction with the top coordinate to calculate the center y coordinate.  Note: This is only needed if you are calculating from a single coordinate.
   */
  height?: number;

  /**
   * Initial width of the element used in conjunction with the left coordinate to calculate the center x coordinate.  Note: This is only needed if you are calculating from a single coordinate.  Note: This is only needed if you are calculating from a single coordinate
   */
  width?: number;

  /**
   * Initial top coordinate of the element used in conjunction with the height dimension to calculate the center y coordinate.  Note: This is only needed if you are calculating from a single coordinate.
   */
  top?: number;

  /**
   * Initial left coordinate of the element used in conjunction with the width dimension to calculate the center x coordinate.  Note: This is only needed if you are calculating from a single coordinate.
   */
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
