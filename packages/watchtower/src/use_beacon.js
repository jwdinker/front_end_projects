import { useState, useEffect, useMemo, useCallback } from 'react';
import { getPosition } from './helpers';
import useWatchTowerContext from './use_watch_tower_context';

/*
useBeacon
-------------
The roles of useBeacon are:
  1. Calculating the position of an element using the provider's scroll.
  2. Listen for changes in the scrollable area and update offsets accordingly.
*/

function useBeacon(element = null) {
  const [dimensions, setDimensions] = useState(() => {
    return { height: 0, width: 0 };
  });
  const [position, setPosition] = useState(() => {
    return { top: 0, left: 0 };
  });
  const { container, scroll, changed } = useWatchTowerContext();

  const refresh = useCallback(() => {
    if (element && element.current) {
      const { offsetHeight, offsetWidth } = element.current;
      setDimensions({ height: offsetHeight, width: offsetWidth });
      setPosition(getPosition(element.current));
    }
  }, [element]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (changed) {
      refresh();
    }
  }, [changed, element, refresh]);

  const value = useMemo(() => {
    const { height, width } = dimensions;
    const top = position.top - scroll.top;
    const left = position.left - scroll.left;
    return {
      element: {
        top,
        left,
        right: left + width,
        bottom: top + height,
        height,
        width,
      },
      scroll,
      container,
    };
  }, [container, dimensions, position.left, position.top, scroll]);

  return value;
}

export default useBeacon;
