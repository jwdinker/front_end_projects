import { useMemo } from 'react';
import usePrevious from '@jwdinker/use-previous';
import { getOverflowingSides, hasSidesChanged } from '../helpers';
import { SIDES } from '../constants';

function useOverflowing(element, boundaries) {
  const overflowing = getOverflowingSides(element, boundaries);

  const previouslyOverflowing = usePrevious(overflowing, overflowing);
  const inBounds = SIDES.every((side) => !overflowing[side]);

  const hasOverflowChanged = useMemo(
    () => !inBounds && hasSidesChanged(previouslyOverflowing, overflowing),
    [inBounds, overflowing, previouslyOverflowing]
  );

  return {
    isOverflowing: !inBounds,
    sides: overflowing,
    changed: hasOverflowChanged,
  };
}

export default useOverflowing;
