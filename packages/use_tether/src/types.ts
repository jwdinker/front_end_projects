import { Padding } from '@jwdinker/prevent-overflow';
import { ElementOrReference } from '@jwdinker/use-dimensions-list';

export type Side = 'top' | 'bottom' | 'left' | 'right';

export type Alignment = Side;

export interface AbbreviatedRectangle {
  top: number;
  left: number;
  height: number;
  width: number;
}

export interface FlippableSides {
  top?: Side[];
  left?: Side[];
  right?: Side[];
  bottom?: Side[];
}

export interface DefaultFlip {
  top?: Side[];
  left?: Side[];
  right?: Side[];
  bottom?: Side[];
}

export interface FlipOptions {
  flip?: FlippableSides;
  preference?: Alignment;
  tethered?: AbbreviatedRectangle[];
}

export type Anchor = AbbreviatedRectangle | ElementOrReference;

export interface PreventableOverflowOptions {
  allow?: Side[];
  padding?: Padding[];
}

export interface Dimensions {
  height: number;
  width: number;
}

export interface TetheredTransform extends AbbreviatedRectangle {
  rotate?: number | undefined;
}

export type CoordinateFromPositionFn = (
  coordinates: AbbreviatedRectangle,
  dimensions: Dimensions
) => number;

export interface CoordinateFromPosition {
  top: CoordinateFromPositionFn;
  centerX: CoordinateFromPositionFn;
  centerY: CoordinateFromPositionFn;
  bottom: CoordinateFromPositionFn;
  left: CoordinateFromPositionFn;
  right: CoordinateFromPositionFn;
}

export type TetheredPosition = 'absolute' | 'fixed';

export type UpdateAnchorPosition = () => void;

export type UseAnchorReturn = [AbbreviatedRectangle, UpdateAnchorPosition];

export type UpdateSizeAndPosition = () => void;

export type UseTetherReturn = [AbbreviatedRectangle[], AbbreviatedRectangle, UpdateSizeAndPosition];
