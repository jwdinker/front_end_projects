import { SIDES, OPPOSITES, TRIANGLE_ROTATIONS } from './constants';

import getOverflowingSides from './get_overflowing_sides';
import getOffsetTotal from './get_offset_total';

/*
 *-----------------------------------------------------------------------------
 * triangleAdjustments
 *-----------------------------------------------------------------------------
 * Another opportunity to refactor and condense the code using common
 * properties.  However, I elected to go the readability route again as the
 * commonalities get real confusing quickly.
 */
const triangleAdjustments = {
  top: {
    top: (_, popover) => popover.height,
    bottom: (triangle) => -triangle.height,
    left: () => 0,
    right: (triangle) => -triangle.width,
  },
  bottom: {
    top: () => 0,
    bottom: (triangle, popover) => -popover.height - triangle.height,
    left: () => 0,
    right: (triangle) => -triangle.width,
  },
  right: {
    // top and bottom are the same as alignment left
    top: (triangle) => (triangle.width - triangle.height) / 2,
    bottom: (triangle) => (-triangle.width - triangle.height) / 2,
    left: (triangle) => (-triangle.width + triangle.height) / 2,
    right: (triangle, popover) => -popover.width - (triangle.width + triangle.height) / 2,
  },
  left: {
    // top and bottom are the same as alignment right
    top: (triangle) => (triangle.width - triangle.height) / 2,
    bottom: (triangle) => (-triangle.width - triangle.height) / 2,
    left: (triangle, popover) => popover.width - triangle.height / 2,
    right: (triangle) => (-triangle.width - triangle.height) / 2,
  },
};

function usePreventOverflow(
  props = {},
  { sides = SIDES, boundary = null, flipArrow = false } = {}
) {
  const { alignment, container, element, popover, triangle, styles } = props;

  /*
   * 1. The overflowing sides are calculated against the boundary using the total offset.
   */
  const overflowing = getOverflowingSides(getOffsetTotal(alignment, popover, triangle), container);
  const inBounds = SIDES.every((side) => !overflowing[side]);

  /*
   *2.  If nothing is overflowing, I don't bother to adjust the styles.
   */
  if (!inBounds) {
    /*

     * 3.  The side params are checked against the intersecting sides. 
     */
    sides.forEach((side) => {
      /*
       * 4.  Some helper variables are created to avoid deeply nested
       *     conditionals where there can be an insane amount of states. Knowing
       *     the side the arrow is located helps cut down immensly on the
       *     conditionals for the popover.
       *
       *     - operator is used to flip styles on opposites sides.
       *
       *     - translateAxis matches the position properties to an axis so we can set
       *       the styles[key].
       *
       *    - didArrowReachSideFirst helps decide which side of the popover will have the triangle height applied to it.
       */
      const isTopOrLeftSide = side === 'top' || side === 'left';
      const oppositeSide = OPPOSITES[side];
      const operator = isTopOrLeftSide ? 1 : -1;
      const isY = side === 'top' || side === 'bottom';
      const translateAxis = isY ? 'translateY' : 'translateX';
      const dimensionType = isY ? 'height' : 'width';
      const didArrowReachSideFirst = side === OPPOSITES[alignment];

      const popoverAdjustment = didArrowReachSideFirst ? triangle.height : 0;
      const triangleAdjustment = triangleAdjustments[alignment][side](triangle, popover);

      if (overflowing[side]) {
        /*
         * 5.  If the popover is overflowing TOP or LEFT, I take the MAX value
         *     of the corresponding boundaries OR just continue to use the
         *     corresponding offset of the popover and/or triangle.
         *
         *     If the popover is overflowing BOTTOM or RIGHT, I take the MIN
         *     value of the corresponding boundaries OR just continue to use the
         *     corresponding offset of the popover and/or triangle.
         *
         * - NOTE: To avoid the performance hit of merging style objects on
         *     every tick and having to pass back new style object, the new
         *     values are imperatively set on the styles object.
         */

        styles.popover.transform[translateAxis] = isTopOrLeftSide
          ? Math.max(container[side] + popoverAdjustment, popover[side])
          : Math.min(container[side] - popover[dimensionType] - popoverAdjustment, popover[side]);

        styles.triangle.transform[translateAxis] = isTopOrLeftSide
          ? Math.max(container[side] + triangleAdjustment, triangle[side])
          : Math.min(container[side] + triangleAdjustment, triangle[oppositeSide]);

        /*
         *  6. The arrow flips under the following conditions:
         *
         *  - When that boundary is the same side as the alignment, meaning the
         *    arrow is on the opposite of the breached boundary hence the reason
         *    it needs to flip.
         */
        const isSameSideAsAlignment = side === alignment;
        if (flipArrow && isSameSideAsAlignment) {
          const oppositeAlignment = OPPOSITES[alignment];

          /*
           * - When element's center is aligned with the popover's size.
           *   Example: element.left - (element.width/2) + popover.width
           */
          const arrowFlipBoundaryAdjustment =
            element[side] +
            (element[dimensionType] / 2) * operator +
            popover[dimensionType] * operator * -1;

          /*
           * - When the popover is overflowing and the popover is less than or
           *   greater than a boundary that matches the side its aligned on.
           */
          const isElementCenterAlignedWithPopoverOffset = isTopOrLeftSide
            ? arrowFlipBoundaryAdjustment <= container[side]
            : arrowFlipBoundaryAdjustment >= container[side];

          /*
           * If all those conditions are met, the triangle is flipped, and the
           * popover is moved up by minus triangle.height
           */
          if (isElementCenterAlignedWithPopoverOffset) {
            styles.triangle.transform[translateAxis] = isTopOrLeftSide
              ? container[side] + triangleAdjustments[oppositeAlignment][side](triangle, popover)
              : container[side] + triangleAdjustments[oppositeAlignment][side](triangle, popover);

            styles.triangle.transform.rotate = TRIANGLE_ROTATIONS[oppositeAlignment];
            styles.popover.transform[translateAxis] += triangle.height * operator;
          }
        }
      }
    });
  }
}

export default usePreventOverflow;
