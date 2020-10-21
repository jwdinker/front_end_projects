import { getPerimeterOfElements, getOverflowingSides } from './helpers';

import { DEFAULT_FLIP, SIDE_OPPOSITES } from '../../constants';
import { FlipOptions, AbbreviatedRectangle } from '../../types';

function flippable(
  anchor: AbbreviatedRectangle,
  boundaries: AbbreviatedRectangle,
  { flip = DEFAULT_FLIP, preference = 'bottom', tethered = [] }: FlipOptions = {}
) {
  let alignment = preference;

  /*
  1.  Find Overflow from Perimeter.
      ---------------------------------------
    The offset perimeter is used to determine overflow when flipping because it
    will show where the popover will and will not fit.
  */
  const perimeter =
    tethered.length > 0 ? getPerimeterOfElements(anchor, tethered, preference) : anchor;

  const overflowing = getOverflowingSides(perimeter, boundaries);

  /*
    2.  Find Flip Replacement 
        ---------------------------------------
    To prevent the constant iteration of alternatives and replacement sides,
    overflowing.changed is checked.  
    */

  if (overflowing.length === 0) {
    alignment = preference;
  } else {
    for (let index = 0; index <= overflowing.length; index += 1) {
      const side = overflowing[index];

      const alternatives = flip[side];

      if (alternatives) {
        const replacement = alternatives.find((alternative) => {
          const fits = overflowing.indexOf(alternative) === -1;

          /*
            If more than 2 sides are overflowing that means the tethered
            elements are in the corner of the container.  If this is the case,
            the opposite alignment of the preferred side will more than likely
            fit, however, this can be avoided with this condition instead of
            checking all possible x,y values of each alignment when this hook is
            impartial to an alignment. 
          */
          return overflowing.length > 1 ? alternative !== SIDE_OPPOSITES[preference] && fits : fits;
        });

        if (replacement) {
          alignment = replacement;
          break;
        }
      }
    }
  }

  return alignment;
}

export default flippable;
