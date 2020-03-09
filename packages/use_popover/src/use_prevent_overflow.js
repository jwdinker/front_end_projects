import { SIDES, OPPOSITES, TRIANGLE_ROTATIONS } from './constants';
import { useCustomBoundaries, useOverflowing } from './internal';

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
  { sides = SIDES, flipArrow = false, boundary = null } = {}
) {
  const { alignment, offsets, styles, viewport } = props;
  const { element, popover, triangle, total } = offsets;

  const boundaries = useCustomBoundaries(boundary, viewport);

  /*
   * 1. The overflowing sides are calculated against the boundary using the
   *    total offset (popover dimension + triangle height).  Unnecessary prevent
   *    overflow checks are avoided by checking if the popover is even in an
   *    overflow state.
   */
  const overflowing = useOverflowing(total, boundaries);
  if (overflowing.isOverflowing) {
    /*
     * 2.  The side params are checked against the intersecting sides.
     */
    sides.forEach((side) => {
      if (overflowing.sides[side]) {
        /*
         * 3.  Some helper variables are created to avoid deeply nested
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
        /*
         * 4.  If the popover is overflowing TOP or LEFT, I take the MAX value
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
          ? Math.max(boundaries[side] + popoverAdjustment, popover[side])
          : Math.min(boundaries[side] - popover[dimensionType] - popoverAdjustment, popover[side]);

        styles.triangle.transform[translateAxis] = isTopOrLeftSide
          ? Math.max(boundaries[side] + triangleAdjustment, triangle[side])
          : Math.min(boundaries[side] + triangleAdjustment, triangle[oppositeSide]);

        /*
         *  5. The arrow flips under the following conditions:
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
            ? arrowFlipBoundaryAdjustment <= boundaries[side]
            : arrowFlipBoundaryAdjustment >= boundaries[side];

          /*
           * If all those conditions are met, the triangle is flipped, and the
           * popover is moved up by minus triangle.height
           */
          if (isElementCenterAlignedWithPopoverOffset) {
            styles.triangle.transform[translateAxis] = isTopOrLeftSide
              ? boundaries[side] + triangleAdjustments[oppositeAlignment][side](triangle, popover)
              : boundaries[side] + triangleAdjustments[oppositeAlignment][side](triangle, popover);

            styles.triangle.transform.rotate = TRIANGLE_ROTATIONS[oppositeAlignment];
            styles.popover.transform[translateAxis] += triangle.height * operator;
          }
        }
      }
    });
  }
}

export default usePreventOverflow;
