import { OPPOSITES } from './constants';

function getOffsetTotal(alignment, popover, triangle) {
  const operator = alignment === 'top' || alignment === 'left' ? 1 : -1;
  const oppositeSide = OPPOSITES[alignment];
  const dimensionType = alignment === 'top' || alignment === 'bottom' ? 'height' : 'width';

  // The triangle height is either added or substracted to the popover offset
  // opposite the current alignment
  return {
    ...popover,
    [oppositeSide]: popover[oppositeSide] + triangle.height * operator,
    [dimensionType]: popover[dimensionType] + triangle.height,
  };
}

export default getOffsetTotal;
