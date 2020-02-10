import { useState, useEffect } from 'react';
import { SIDES, ELEMENT_TYPES } from './constants';
import getOverflowingSides from './get_overflowing_sides';

function useHideable(props, { untilFirstSeen = true } = {}) {
  const { styles, element, container } = props;
  const [seen, setSeen] = useState(() => {
    return false;
  });

  useEffect(() => {
    if (!seen && untilFirstSeen) {
      const overflowing = getOverflowingSides(element, container);
      const inBounds = SIDES.every((side) => !overflowing[side]);
      if (inBounds) {
        setSeen(true);
      }
    }
  }, [container, element, seen, untilFirstSeen]);

  if (!seen) {
    ELEMENT_TYPES.forEach((type) => {
      styles[type].visibility = 'hidden';
    });
  }

  return {
    seen,
  };
}

export default useHideable;
