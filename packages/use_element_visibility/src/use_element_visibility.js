import { useRef, useMemo } from 'react';
import { INITIAL_MEASUREMENTS, DEFAULTS } from './constants';

import { getStages, getDirection, makeBoundaryCallback, filterEdges, conditionals, getVisibleAmount } from './helpers';

const _inBoundaries = makeBoundaryCallback(conditionals.inBoundaries);
const _isOverflowing = makeBoundaryCallback(conditionals.isOverflowing);
const getEdges = makeBoundaryCallback(filterEdges);

function useElementVisibility(element, ancestor) {
  const previousMeasurements = useRef(INITIAL_MEASUREMENTS);

  const inBoundaries = useMemo(() => {
    return _inBoundaries(element, ancestor);
  }, [ancestor, element]);

  const isOverflowing = useMemo(() => {
    return inBoundaries && _isOverflowing(element, ancestor);
  }, [ancestor, element, inBoundaries]);

  const at = useMemo(() => {
    if (isOverflowing) {
      return getEdges(element, ancestor);
    }
    return DEFAULTS.AT;
  }, [ancestor, element, isOverflowing]);

  const { entering, exiting, overflowing } = useMemo(() => {
    if (isOverflowing) {
      const direction = getDirection(previousMeasurements.current, element);
      const stages = getStages(at, direction);
      previousMeasurements.current = element;
      return stages;
    }
    return DEFAULTS.STAGES;
  }, [at, element, isOverflowing]);

  const { pct, px } = useMemo(() => {
    if (inBoundaries) {
      return getVisibleAmount(element, ancestor);
    }
    return DEFAULTS.VIEWABLE;
  }, [ancestor, element, inBoundaries]);

  const visible = useMemo(() => px[0] > 0 && px[1] > 0, [px]);

  const value = useMemo(
    () => ({
      at,
      visible,
      entering,
      exiting,
      overflowing,
      pct,
      px,
    }),
    [at, entering, exiting, overflowing, pct, px, visible]
  );

  return value;
}

export default useElementVisibility;
