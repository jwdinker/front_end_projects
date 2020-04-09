import { UseScalableState, Point, UseScalableOptions } from '@jwdinker/use-scalable';

export interface UseScaleOptions extends UseScalableOptions {
  mouse?: boolean;
  touch?: number;
}

export type Scale = (point: Point, center: Point) => void;

export interface UseScaleReturn extends UseScalableState {
  /** Boolean indicating whether the scaling is active or inactive. */
  isScaling: boolean;

  /** Handler for manually computing the scale value given a 2 points.  */
  scale: Scale;
}
