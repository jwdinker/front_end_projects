import { useCallback, useState, useEffect, useMemo } from 'react';
import useAnimationFrame from '@jwdinker/use-animation-frame';
import { getDimensions, hasDimensionChanged } from './helpers';

function useScrollSize(element, { interval = 200 } = {}) {
  const [dimensions, setDimensions] = useState(
    () => ({
      height: 0,
      width: 0,
    }),
    []
  );
  const [changed, setChanged] = useState(false);

  // This toggle is a bit unusual but is neccessary.  The reason - there is a
  // potential for hundreds of equality checks just to check if the size is
  // changed if if used in a context where the consumer has to check if the size
  // is changed.  It is just easier to toggle that the size has changed.

  useEffect(() => {
    if (changed) {
      setChanged(false);
    }
  }, [changed]);

  const { height, width } = dimensions;
  const handler = useCallback(() => {
    const current = getDimensions(element.current || element);
    if (hasDimensionChanged({ height, width }, current)) {
      setDimensions(current);
      setChanged(true);
    }
  }, [element, height, width]);

  useAnimationFrame(
    useMemo(
      () => ({
        delay: interval,
        onFrame: handler,
      }),
      [handler, interval]
    )
  );

  return [dimensions, changed];
}

export default useScrollSize;
