import { useMemo } from 'react';
import usePrevious from '@jwdinker/use-previous';
import { getOverflowingSides, hasSidesChanged, isAbbreviated, toRectangle } from './helpers';
import { SIDES } from './constants';

import { AbbreviatedRectangle, Rectangle, Overflowing, UseOverflowingReturn } from './types';

function useOverflowing(
  element: AbbreviatedRectangle | Rectangle,
  boundaries: AbbreviatedRectangle | Rectangle
): UseOverflowingReturn {
  const _element = isAbbreviated(element) ? toRectangle(element as AbbreviatedRectangle) : element;
  const _boundaries = isAbbreviated(boundaries)
    ? toRectangle(boundaries as AbbreviatedRectangle)
    : boundaries;
  const overflowing = getOverflowingSides(_element as Rectangle, _boundaries as Rectangle);

  const previouslyOverflowing = usePrevious(overflowing, overflowing) as Overflowing;
  const keys = SIDES.filter((side) => overflowing[side]);
  const inBounds = keys.length === 0;

  const hasOverflowChanged = useMemo(
    (): boolean => hasSidesChanged(previouslyOverflowing, overflowing),
    [overflowing, previouslyOverflowing]
  );

  return {
    isOverflowing: !inBounds,
    sides: keys,
    changed: hasOverflowChanged,
  };
}

export default useOverflowing;
