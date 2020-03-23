import { AbbreviatedRectangle, Perimeter, Alignment, Rectangle } from './types';
import { SIDES, SIDE_OPPOSITES } from './constants';

export function toRectangle(element: AbbreviatedRectangle): Rectangle {
  const { top, left, height, width } = element;
  return {
    top,
    left,
    right: left + width,
    bottom: top + height,
    height,
    width,
  };
}

export function mergeToPerimeter(
  anchor: Rectangle,
  elements: AbbreviatedRectangle[],
  preference: Alignment
): Perimeter {
  const { maxHeight, maxWidth, totalHeight, totalWidth } = elements.reduce(
    (accumulator, element) => {
      accumulator.maxHeight = Math.max(accumulator.maxHeight, element.height);
      accumulator.maxWidth = Math.max(accumulator.maxWidth, element.width);
      accumulator.totalHeight += element.height;
      accumulator.totalWidth += element.width;

      return accumulator;
    },
    { maxHeight: 1, maxWidth: 1, totalHeight: 0, totalWidth: 0 }
  );

  const centerX = anchor.left + anchor.width / 2;
  const centerY = anchor.top + anchor.height / 2;

  const halfMaxWidth = maxWidth / 2;
  const halfMaxHeight = maxHeight / 2;

  /*
    The perimeter sides that match the preferred axis gets the sum of the
    matching anchor axis side +/- the total width or height (depending on the
    axis) of all the secondary elements.  Since the perimeter is dynamically
    generated and the flipable element could still be animating to its
    replacement position when the preferred position could become available, the
    preferred sides must always equal anchor[side] + total.height/width instead
    of just anchor[side].   

    The remaining sides are calculated from the sum of center of the anchor
    element rectangle side +/- the max height/width dimension found from all the
    elements. This creates phantom padding on opposite axis of the preffered
    axis that ensures the element will flip should they reach a boundary.  The
    phantom padding below is depicted with an '*' when the preffered side is a
    vertical.


      ___________________________________
      |        |               |        |
      |        |   tethered    |        | 
      |        |               |        |
      |        _____       _____        |
      |             \    /              |
      |              \  /               |
      |     ***********************     |
      |     ******|=========|******     |
      |     ******| element |******     |
      |     ******|=========|******     |
      |     ***********************     |
      |               / \               |
      |              /   \              |
      |         ____       ____         |
      |        |               |        |
      |        |    tethered   |        | 
      |        |               |        |
      |________|_______________|________|
  */
  const perimeter = SIDES.reduce(
    (accumulator, side) => {
      const isPreferredAxis = side === preference || side === SIDE_OPPOSITES[preference];
      const isInnerSide = side === 'top' || side === 'left';
      const isY = side === 'top' || side === 'bottom';

      const operator = isInnerSide ? -1 : 1;
      const center = isY ? centerY : centerX;
      const total = isY ? totalHeight : totalWidth;
      const max = isY ? halfMaxHeight : halfMaxWidth;

      accumulator[side] = isPreferredAxis
        ? anchor[side] + total * operator
        : center + max * operator;
      return accumulator;
    },
    { top: 0, left: 0, bottom: 0, right: 0 }
  );

  return perimeter;
}
