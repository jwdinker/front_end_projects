import { useMemo, useState, useEffect } from 'react';

import useOverflowing from '@jwdinker/use-overflowing';
import { Rectangle, AbbreviatedRectangle, UseFlipOptions, Alignment } from './types';
import { mergeToPerimeter, toRectangle } from './helpers';
import { DEFAULT_FLIP, SIDE_OPPOSITES } from './constants';

/**
 *
 * @param anchor The top, left, height, width values of the anchor element that
 * the tethered elements attach to.  If no tethered elements are included the
 * anchor will determine the replacement alignment.
 * @param boundaries The top, bottom, left, and right values used to constrain
 * the element.
 * @param options An object to alter the default flip behavior of the tethered elements.
 *
 * @param options.flip An object containing the sides the tethered elements flip
 * to when encountering a boundary.
 *
 * @param options.preference The preferred alignment.
 *
 * @param options.tethered An optional array of tethered elements containing
 * top, left, height, width values.  The values of these elements will
 * be autocompute as padding against the boundaries.
 *
 */

function useFlip(
  anchor: AbbreviatedRectangle,
  boundaries: Rectangle,
  { flip = DEFAULT_FLIP, preference = 'bottom', tethered = [] }: UseFlipOptions = {}
): Alignment {
  const [alignment, setAlignment] = useState(preference);

  const flipable = useMemo(() => Object.keys(flip), [flip]);

  const perimeter =
    tethered.length > 0 ? mergeToPerimeter(toRectangle(anchor), tethered, preference) : anchor;

  /*
  1.  Find Overflow from Perimeter.
      ---------------------------------------
    The offset perimeter is used to determine overflow when flipping because it
    will show where the popover will and will not fit.
  */
  const overflowing = useOverflowing(perimeter, boundaries);

  /*
  2.  Find Flip Replacement 
      ---------------------------------------
  To prevent the constant iteration of alternatives and replacement sides,
  overflowing.changed is checked.  
  */

  useEffect(() => {
    if (overflowing.changed) {
      if (!overflowing.isOverflowing) {
        setAlignment(preference);
      } else {
        for (let index = 0; index <= overflowing.sides.length; index += 1) {
          const side = overflowing.sides[index];

          const alternatives = flip[side];

          if (alternatives) {
            const replacement = alternatives.find((alternative) => {
              const fits = overflowing.sides.indexOf(alternative) === -1;

              /*
              If more than 2 sides are overflowing that means the tethered
              elements are in the corner of the container.  If this is the case,
              the opposite alignment of the preferred side will more than likely
              fit, however, this can be avoided with this condition instead of
              checking all possible x,y values of each alignment when this hook
              is impartial to an alignment. 
              */
              return overflowing.sides.length > 1
                ? alternative !== SIDE_OPPOSITES[preference] && fits
                : fits;
            });

            if (replacement) {
              setAlignment(replacement);
              break;
            }
          }
        }
      }
    }
  }, [alignment, boundaries, flip, flipable, overflowing, perimeter, preference]);

  return alignment;
}

export default useFlip;
