import React from 'react';

import useEventListener from '@jwdinker/use-event-listener';
import useRequestAnimationFrameState from '@jwdinker/use-request-animation-frame-state';
import { getScrollCoordinates } from '@jwdinker/scroll-helpers';
import useTimeout from '@jwdinker/use-timeout';
import easingFns, { EASING_TYPES } from '@jwdinker/easing-fns';
import { ScrollElement, ScrollToCoord, ScrollToOptions, UseScrollReturn } from './types';
import { INITIAL_STATE, handleStartOrMove, end } from './state';
import { getElement } from './helpers';
import { SCROLL_PROP_KEYS } from './constants';

const { useEffect, useCallback, useRef } = React;

function useScroll(
  element: ScrollElement = null,
  { passive = true, capture = false, once = false, consolidate = true } = {}
): UseScrollReturn {
  const rafId = useRef(0);
  const [scroll, setScroll] = useRequestAnimationFrameState(INITIAL_STATE);

  const cancelAnimation = () => {
    if (rafId.current) {
      window.cancelAnimationFrame(rafId.current);
      rafId.current = 0;
    }
  };

  const [beginEndCountdown, clearEndTimeout] = useTimeout(() => {
    const _element = getElement(element);
    if (_element) {
      const coordinates = getScrollCoordinates(_element);
      setScroll((previousState) => end(previousState, coordinates));
    }
  }, 45);

  const handler = (event: any) => {
    const isAnimating = !!rafId.current;
    /*
      Don't start the end timeout if the scroll is animating because the end
      timeout can run prior to the animation finishing causing phases to switch
      switch rapidly from 'start' to 'end'. 
    */
    if (!isAnimating) {
      clearEndTimeout();
      beginEndCountdown();
    }
    const coordinates = getScrollCoordinates(event.target || event.currentTarget);
    setScroll((previousState) => handleStartOrMove(previousState, coordinates, isAnimating));
  };

  const scrollable = useEventListener(element, 'scroll', handler, {
    passive,
    capture,
    once,
    consolidate,
  });

  /*
    Cancel the animation if a user initiates a scroll while a scroll animation
    is active.
  */
  const wheelable = useEventListener(element, 'wheel touchstart', cancelAnimation);

  const scrollTo = useCallback(
    (scrollToProps: ScrollToOptions) => {
      const { x = 0, y = 0, duration = 0, easing = EASING_TYPES.EASE_IN_OUT_QUINT } = scrollToProps;
      const _element = getElement(element);
      if (_element) {
        const startCoordinates = getScrollCoordinates(_element);
        const endCoordinates = { x, y };

        if (duration === 0) {
          _element.scrollTo(x, y);
        } else {
          const startTime = Date.now();
          cancelAnimation();

          const animate = () => {
            const elapsed = Math.max(1, Date.now() - startTime);
            const hasFinished = elapsed > duration;
            const coordinates = SCROLL_PROP_KEYS.reduce(
              (accumulator, key, index) => {
                if (hasFinished) {
                  accumulator[index] = Math.round(endCoordinates[key]);
                } else {
                  const ease = easingFns[easing](elapsed / duration);
                  const remaining =
                    startCoordinates[key] + (endCoordinates[key] - startCoordinates[key]) * ease;

                  accumulator[index] = remaining;
                }
                return accumulator;
              },
              [0, 0] as ScrollToCoord
            );

            if (hasFinished) {
              cancelAnimation();
              beginEndCountdown();
            } else {
              rafId.current = window.requestAnimationFrame(animate);
            }
            _element.scrollTo(...coordinates);
          };
          animate();
        }
      }
    },
    [beginEndCountdown, element]
  );

  useEffect(() => {
    scrollable.attach();
    wheelable.attach();
    return () => {
      scrollable.attach();
      wheelable.detach();
    };
  }, [scrollable, wheelable]);

  return [scroll, scrollTo];
}

export default useScroll;
