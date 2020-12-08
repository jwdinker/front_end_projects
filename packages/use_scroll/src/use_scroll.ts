import React from 'react';

import useEventListener from '@jwdinker/use-event-listener';
import useRequestAnimationFrameState from '@jwdinker/use-request-animation-frame-state';
import { getScrollCoordinates } from '@jwdinker/scroll-helpers';
import useTimeout from '@jwdinker/use-timeout';
import { EASING_TYPES } from '@jwdinker/easing-fns';
import { ScrollElement, ScrollToOptions, UseScrollReturn } from './types';
import { INITIAL_STATE, handleStartOrMove, end } from './state';
import { getElement, animateScroll } from './helpers';

const { useEffect, useCallback } = React;

function useScroll(
  element: ScrollElement = null,
  { passive = true, capture = false, once = false, consolidate = true } = {}
): UseScrollReturn {
  const [scroll, setScroll] = useRequestAnimationFrameState(INITIAL_STATE);

  const [start, clear] = useTimeout(() => {
    const _element = getElement(element);
    if (_element) {
      const coordinates = getScrollCoordinates(_element);
      setScroll((previousState) => end(previousState, coordinates));
    }
  }, 45);

  const handler = (event: any) => {
    clear();
    start();
    const coordinates = getScrollCoordinates(event.target || event.currentTarget);
    setScroll((previousState) => handleStartOrMove(previousState, coordinates));
  };

  const listener = useEventListener(element, 'scroll', handler, {
    passive,
    capture,
    once,
    consolidate,
  });

  const scrollTo = useCallback(
    (scrollToProps: ScrollToOptions) => {
      const { x = 0, y = 0, duration = 0, easing = EASING_TYPES.EASE_IN_OUT_QUINT } = scrollToProps;
      const _element = getElement(element);
      if (_element) {
        const startCoordinates = getScrollCoordinates(_element);
        const destinationCoordinates = { x, y };

        if (duration === 0) {
          _element.scrollTo(x, y);
        } else {
          animateScroll({
            startCoord: startCoordinates,
            endCoord: destinationCoordinates,
            duration,
            easing,
            callback: (xy) => _element.scrollTo(...xy),
          });
        }
      }
    },
    [element]
  );

  useEffect(() => {
    listener.attach();
    return listener.detach;
  }, [listener]);

  return [scroll, scrollTo];
}

export default useScroll;
