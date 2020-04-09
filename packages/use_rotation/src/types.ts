import { UseRotatableReturnState, Point } from '@jwdinker/use-rotatable';

export interface UseRotationOptions {
  initialAngle?: number;
  mouse?: boolean;
  touch?: number;
}

export type Rotate = (point: Point, center: Point) => void;

export interface UseRotationReturn extends UseRotatableReturnState {
  /** Boolean indicating whether the rotation is active or inactive. */
  active: boolean;

  /** Handler for manually computing the rotation value given a 2 points.  */
  rotate: Rotate;
}
