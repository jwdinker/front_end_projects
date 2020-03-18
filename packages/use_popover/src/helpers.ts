import {
  ALIGNMENT_OPPOSITE_TYPES,
  Alignment,
  AbbreviatedRectangle,
  Side,
  SIDES,
} from '@jwdinker/use-tether';

import { ReduceSidesReturnValue, Padding } from './types';

export function getArrowRotationAdjustment(arrow: AbbreviatedRectangle): number {
  return Math.abs(
    (arrow.left + arrow.top) / 2 - (arrow.left + arrow.width + arrow.top + arrow.height) / 2
  );
}

export function computePopoverPadding(
  alignment: Alignment,
  side: Alignment,
  popover: AbbreviatedRectangle,
  arrow: AbbreviatedRectangle
): number {
  const isArrowBottomOrRight = alignment === 'top' || alignment === 'left';
  const operator = isArrowBottomOrRight ? -1 : 1;
  const isSideOppositeOfAlignment = side === ALIGNMENT_OPPOSITE_TYPES[alignment];
  return isSideOppositeOfAlignment ? arrow.height * operator : 0;
}

export function computeArrowPadding(
  alignment: Alignment,
  side: Alignment,
  popover: AbbreviatedRectangle,
  arrow: AbbreviatedRectangle
): number {
  const isVerticallyAligned = alignment === 'top' || alignment === 'bottom';
  const isYSide = side === 'top' || side === 'bottom';
  const isInnerSide = side === 'top' || side === 'left';

  const popoverDimensionType = isVerticallyAligned ? 'height' : 'width';
  const arrowDimensionType = isYSide ? 'width' : 'height';
  const isSideSameAsAlignment = side === alignment;

  const operator = isInnerSide ? 1 : -1;
  const oppositeOperator = -operator;

  const popoverOffset = isSideSameAsAlignment ? popover[popoverDimensionType] * operator : 0;

  if (isVerticallyAligned) {
    return popoverOffset;
  }
  return (
    popoverOffset +
    arrow[arrowDimensionType] * operator +
    getArrowRotationAdjustment(arrow) * oppositeOperator
  );
}

export function reduceSides(fn: (side: Side) => number): ReduceSidesReturnValue {
  return SIDES.reduce((accumulator, side) => {
    accumulator[side] = fn(side);
    return accumulator;
  }, {}) as Padding;
}
