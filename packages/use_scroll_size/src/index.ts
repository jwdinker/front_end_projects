import { useCallback, useState, useEffect } from 'react';
import useAnimationFrame from '@jwdinker/use-animation-frame';
import { getDimensions, hasDimensionChanged } from './helpers';

import { UseScrollSizeReturn, ScrollableElement } from './types';

function useScrollSize(element: ScrollableElement, { interval = 200 } = {}): UseScrollSizeReturn {
  const [dimensions, setDimensions] = useState(() => ({
    height: 0,
    width: 0,
  }));
  const [changed, setChanged] = useState(false);

  /*
  This toggle is a bit unusual but is neccessary.  The reason - there is a
  potential for hundreds of equality checks just to check if the size is changed
  if used in a context where the consumer has to check if the size is
  changed.  It is just easier to toggle that the size has changed.
*/
  useEffect(() => {
    if (changed) {
      setChanged(false);
    }
  }, [changed, element]);

  const { height, width } = dimensions;
  const handler = useCallback(() => {
    const _element = element && 'current' in element ? element.current : element;

    if (_element) {
      const current = getDimensions(_element);
      if (hasDimensionChanged({ height, width }, current)) {
        setDimensions(current);
        setChanged(true);
      }
    }
  }, [element, height, width]);

  const [observe, unobserve] = useAnimationFrame(handler, interval);

  useEffect(() => {
    observe();
    return unobserve;
  }, [observe, unobserve]);

  return [dimensions, changed];
}

export default useScrollSize;
