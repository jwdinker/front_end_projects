import * as React from 'react';
import useAnimationFrame from '@jwdinker/use-animation-frame';
import { getDimensions, hasDimensionChanged, getElement } from './helpers';

import { UseScrollSizeReturn, ScrollableElement } from './types';

const { useState, useEffect } = React;

function useScrollSize(element: ScrollableElement, interval = 1000): UseScrollSizeReturn {
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

  const [observe, unobserve] = useAnimationFrame(() => {
    const _element = getElement(element);

    if (_element) {
      const current = getDimensions(_element);
      setDimensions((previous) => {
        if (hasDimensionChanged(previous, current)) {
          return current;
        }
        return previous;
      });
    }
  }, interval);

  useEffect(() => {
    observe();
    return unobserve;
  }, [observe, unobserve]);

  return [dimensions, changed];
}

export default useScrollSize;
