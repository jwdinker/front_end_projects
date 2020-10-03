import { Rectangle } from '@jwdinker/use-bounding-client-rect';
import { Dimensions } from '@jwdinker/use-dimensions';

export type Alignment = 'top' | 'bottom' | 'left' | 'right';

export type Side = 'top' | 'bottom' | 'left' | 'right';

export interface AlignmentTypes {
  top: 'top';
  bottom: 'bottom';
  left: 'left';
  right: 'right';
}

export interface AlignmentOppositeTypes {
  top: 'bottom';
  bottom: 'top';
  left: 'right';
  right: 'left';
}

export interface AbbreviatedRectangle {
  top: number;
  left: number;
  height: number;
  width: number;
}

export interface TetherTogglers {
  watch(): void;
  unwatch(): void;
}

type CoordinateFromPositionFn = (
  coordinates: AbbreviatedRectangle,
  dimensions: Dimensions
) => number;

export interface CoordinateFromPosition {
  top: CoordinateFromPositionFn;
  bottom: CoordinateFromPositionFn;
  left: CoordinateFromPositionFn;
  right: CoordinateFromPositionFn;
  centerX: CoordinateFromPositionFn;
  centerY: CoordinateFromPositionFn;
}

export type UseTetherReturnValue = [
  AbbreviatedRectangle | Rectangle,
  AbbreviatedRectangle | Rectangle,
  TetherTogglers
];

export type Anchor =
  | React.RefObject<HTMLElement | undefined>
  | Rectangle
  | AbbreviatedRectangle
  | null;

export interface Align {
  top(): void;
  bottom(): void;
  left(): void;
  right(): void;
}

export type UseAlignmentReturnValue = [Alignment, Align];
