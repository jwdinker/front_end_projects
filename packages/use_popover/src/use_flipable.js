import { useMemo, useEffect } from 'react';
import { FLIP_DEFAULTS } from './constants';
import { useCustomBoundaries, useOverflowing } from './internal';

function useFlipable(props = {}, { sides = FLIP_DEFAULTS, boundary = null } = {}) {
  const { alignment, preference, viewport, align, offsets } = props;
  const flipable = useMemo(() => Object.keys(sides), [sides]);

  /*
  1.  Determine the Boundaries. 
      ---------------------------------------
   -  If a boundary element is passed in, the offsets are computed and that is
      used as a boundary.
   -  Otherwise, the viewport is used as a fallback.  
  */
  const boundaries = useCustomBoundaries(boundary, viewport);

  /*
  2.  Find Overflow from Perimeter.
      ---------------------------------------
  -   The offset perimeter is used to determine overflow when flipping because
      it will show where the popover will and will not fit.
  -   The perimeter is the sum of the offsets plus the triangle height.

      __________________________________
      |                                 |
      |            perimeter            |
      |            _________            |
      |           |         |           |
      | perimeter | element | perimeter |
      |           |_________|           |
      |                                 |
      |            perimeter            |
      |_________________________________|
  */
  const overflowing = useOverflowing(offsets.perimeter, boundaries);

  /*
  3.  Check Preference. 
      ---------------------------------------
     The preferred alignment is used when: 
     - The preferred side is NOT overflowing.
     - The current alignment is not the preferred alignment.
  */
  const isPreference = alignment !== preference && !overflowing.sides[preference];

  useEffect(() => {
    if (isPreference) {
      align(preference);
    }
  }, [align, isPreference, preference]);

  /*
  4.  Find Flip Replacement 
      ---------------------------------------
  To prevent the constant iteration of alternatives and replacement sides,
  overflowing.changed is checked.  If a flipable side fits, a new is
  alignment is set via the align method.
  */
  useEffect(() => {
    if (overflowing.changed && !isPreference) {
      flipable.forEach((side) => {
        if (overflowing.sides[side]) {
          const alternatives = sides[side];
          const replacement = alternatives.find((alternative) => !overflowing.sides[alternative]);

          if (replacement) {
            align(replacement);
          }
        }
      });
    }
  }, [align, flipable, isPreference, overflowing, preference, sides]);
}

export default useFlipable;
