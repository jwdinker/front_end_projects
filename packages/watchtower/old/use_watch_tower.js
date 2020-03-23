import { useCallback, useState, useRef, useEffect, useMemo } from 'react';
import useAnimationFrame from '@jwdinker/use-animation-frame';
import useEventListener from '@jwdinker/use-event-listener';

import {
  getScrollableAncestor,
  makeHasChanged,
  getScrollOffsets,
  getScrollDimensions,
  normalizeMeasurements,
} from './helpers';
import { EVENT_TYPES, INITIAL_MEASUREMENTS, RECT_PROPS, INITIAL_SCROLL } from './constants';
import getWindowMeasurements from './helpers/get_window_measurements';

const hasChanged = makeHasChanged(RECT_PROPS);

/*
useWatchable
------------
The roles of useWatchable is to track the size and position of element and it's
scrollable container.
*/

function useWatchTower(element = null, { interval = 500 } = {}) {
  const ancestor = useRef();
  const isWindow = useRef();

  const [containerMeasurements, setContainerMeasurements] = useState(INITIAL_MEASUREMENTS);
  const [elementMeasurements, setElementMeasurements] = useState(INITIAL_MEASUREMENTS);
  const [scroll, setScroll] = useState(() => INITIAL_SCROLL);

  const handleScroll = useCallback(() => {
    const { height, width } = getScrollDimensions(ancestor.current);
    const { left, top } = getScrollOffsets(ancestor.current);
    setScroll((previous) => ({
      top,
      left,
      delta: {
        top: previous.top,
        left: previous.left,
      },
      height,
      width,
    }));
  }, []);

  const handleResize = useCallback(() => {
    setContainerMeasurements(getWindowMeasurements());
  }, []);

  useEffect(() => {
    if (element && element.current) {
      ancestor.current = getScrollableAncestor(element.current);
      isWindow.current = ancestor.current === window;

      if (isWindow.current) {
        handleResize();
      }
      handleScroll();
    }
  }, [element, handleResize, handleScroll]);

  const handleFrame = useCallback(() => {
    if (element && element.current) {
      const nextElementMeasurements = element.current.getBoundingClientRect();
      const hasElementChanged = hasChanged(elementMeasurements, nextElementMeasurements);
      if (hasElementChanged) {
        setElementMeasurements(normalizeMeasurements(nextElementMeasurements));
      }
      if (!isWindow.current) {
        const nextContainerMeasurements = ancestor.current.getBoundingClientRect();
        const hasContainerChanged = hasChanged(containerMeasurements, nextContainerMeasurements);
        if (hasContainerChanged) {
          setContainerMeasurements(normalizeMeasurements(nextContainerMeasurements));
        }
      }
    }
  }, [containerMeasurements, element, elementMeasurements]);

  useAnimationFrame(
    useMemo(
      () => ({
        delay: interval,
        onFrame: handleFrame,
      }),
      [handleFrame, interval]
    )
  );

  useEventListener(
    useMemo(
      () => ({
        target: typeof window !== 'undefined' && isWindow.current ? window : null,
        type: EVENT_TYPES.RESIZE,
        handler: handleResize,
        consolidate: true,
        passive: true,
      }),
      [handleResize]
    )
  );

  useEventListener(
    useMemo(
      () => ({
        target: ancestor,
        type: EVENT_TYPES.SCROLL,
        handler: handleScroll,
        consolidate: true,
        passive: true,
      }),
      [handleScroll]
    )
  );

  return useMemo(() => {
    return {
      element: elementMeasurements,
      container: containerMeasurements,
      scroll,
    };
  }, [containerMeasurements, elementMeasurements, scroll]);
}

export default useWatchTower;
