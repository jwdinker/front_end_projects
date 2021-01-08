export type Point = number[];

export type DistanceFromCenter = number[];
export type XYZ = number[];

export interface ScalableOptions {
  /**
   * The initial [x,y,z] scale values.
   */
  initialScale?: XYZ;

  /**
   * Minimum scale for the x,y,z axis.
   */
  min?: XYZ;

  /**
   * Maximum scale for the x,y,z axis.
   */
  max?: XYZ;
}

export interface ScaleState {
  isScaling: boolean;
  xyz: number[];
  distanceFromCenter: DistanceFromCenter;
}

export type ScaleStart = (point: Point, center: Point) => void;
export type ScaleMove = (point: Point, center: Point) => void;
export type ScaleEnd = () => void;
export type ScaleTo = (xyz: number[]) => void;

export interface ScalableHandlers {
  start: ScaleStart;
  move: ScaleMove;
  end: ScaleEnd;
  scaleTo: ScaleTo;
}

export type ScalableReturn = [ScaleState, ScalableHandlers];
