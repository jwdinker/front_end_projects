import { useMemo } from 'react';
import { SIDES, FLIP_DEFAULTS } from './constants';
import getOffsetTotal from './get_offset_total';
import formatStyles from './format_styles';
import getOverlowingSides from './get_overflowing_sides';

function useFlipable(props = {}, { sides = FLIP_DEFAULTS, boundary = null } = {}) {
  const { alignment, container, popover, triangle, getOffsets } = props;

  const flipable = useMemo(() => Object.keys(sides), [sides]);

  const overflowing = getOverlowingSides(getOffsetTotal(alignment, popover, triangle), container);
  const inBounds = SIDES.every((side) => !overflowing[side]);

  if (!inBounds) {
    flipable.forEach((side) => {
      if (overflowing[side]) {
        const alternatives = sides[side];

        const replacementAlignment = alternatives.find((alternative) => !overflowing[alternative]);

        if (replacementAlignment) {
          /* eslint-disable no-param-reassign */
          props.alignment = replacementAlignment;
          const newOffsets = getOffsets(replacementAlignment);
          props.popover = newOffsets.popover;
          props.triangle = newOffsets.triangle;
          props.styles = formatStyles(newOffsets);
          /* eslint-enable no-param-reassign */
        }
      }
    });
  }
}

export default useFlipable;
