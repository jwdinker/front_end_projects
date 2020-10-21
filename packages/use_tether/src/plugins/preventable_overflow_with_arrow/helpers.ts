import { Padding } from '@jwdinker/prevent-overflow';
import { ALIGNMENT_OPPOSITE_TYPES } from '../../constants';
import { Alignment, AbbreviatedRectangle } from '../../types';

export function getTetherablePadding(alignment: Alignment, arrow: AbbreviatedRectangle): Padding {
  const padding = { top: 0, left: 0, bottom: 0, right: 0 };
  const isArrowBottomOrRight = alignment === 'top' || alignment === 'left';
  const operator = isArrowBottomOrRight ? -1 : 1;
  const oppositeSide = ALIGNMENT_OPPOSITE_TYPES[alignment];
  padding[oppositeSide] = arrow.height * operator;
  return padding;
}

export const getArrowPadding = (
  alignment: Alignment,
  arrow: AbbreviatedRectangle,
  element: AbbreviatedRectangle
) => {
  const isLeft = alignment === 'left';
  const isRight = alignment === 'right';
  const isHorizontal = isLeft || isRight;
  const dimensionType = isHorizontal ? 'width' : 'height';
  const isTopOrLeft = alignment === 'top' || alignment === 'left';
  const oppositeAlignment = ALIGNMENT_OPPOSITE_TYPES[alignment];
  const operator = isTopOrLeft ? 1 : -1;

  const padding = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  padding[alignment] = element[dimensionType] * operator;

  const translateAdjustment = Math.abs(arrow.width / 2 - arrow.height / 2) * operator;

  if (isHorizontal) {
    const paddingSide = padding[alignment];

    padding[alignment] = paddingSide - translateAdjustment;
    padding[oppositeAlignment] = translateAdjustment;
    padding.top = arrow.width / 2 - arrow.height / 2;
    padding.bottom = arrow.height / 2 - arrow.width / 2;
  }

  return padding;
};
