import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import useTimeout from '@jwdinker/use-timeout';
import useEventListener from '@jwdinker/use-event-listener';

import { DIRECTIONS, INITIAL_STATE } from './constants';
import { getDirection, getCoordinates } from './helpers';

import {
  ScrollStateOptions,
  ElementOrWindow,
  ScrollElement,
  UseScrollStateReturn,
  ScrollState,
  PreviousScrollValues,
} from './types';

function useScrollState(
  element: ScrollElement = null,
  { endDelay = 100, passive = false, capture = false }: ScrollStateOptions = {}
): UseScrollStateReturn {
  const event = useRef<Event | null>(null);
  const [scroll, setScroll] = useState<ScrollState>(() => INITIAL_STATE);
  const previous = useRef<PreviousScrollValues>(INITIAL_STATE);

  // The previous state can't be used inside setScroll to determine direction
  // because the async nature of setState will cause the previous and current
  // scroll values to be the same...atleast it does when using hot module
  // replacement.
  const handleSetState = useCallback((target: HTMLElement | Window, active = true) => {
    const coordinates = getCoordinates(target);

    setScroll({
      active,
      ...coordinates,
      direction: active
        ? getDirection(
            previous.current.left,
            previous.current.top,
            coordinates.left,
            coordinates.top
          )
        : DIRECTIONS.NONE,
    });
  }, []);

  const getElement = useCallback(() => {
    if (element && 'current' in element) {
      return element.current;
    }
    return element;
  }, [element]);

  // The initial values of the scroll are taken on the initial render because of the remote
  // possibility that the DOM scroll state is cached.
  useEffect(() => {
    const _element = getElement();
    if (_element) {
      handleSetState(_element, false);
    }
  }, [getElement, handleSetState]);

  useEffect(() => {
    // A reference object has to be used instead of a usePrevious hook in order
    // to prevent rerenders on the initial measurements.  Otherwise, the scalars
    // destructured on the depenency array in handleSetState will trigger a
    // rerender and infinite loop.

    previous.current = {
      top: scroll.top,
      left: scroll.left,
    };
  }, [scroll.left, scroll.top]);

  const end = useCallback(() => {
    const _element = getElement();
    if (_element) {
      return handleSetState(_element, false);
    }
    return false;
  }, [getElement, handleSetState]);

  const [start, clear] = useTimeout(end, endDelay);

  const handler = useCallback(
    (_event: Event) => {
      event.current = _event;
      const { currentTarget } = _event;

      clear();
      start();

      return handleSetState(currentTarget as ElementOrWindow, true);
    },
    [clear, handleSetState, start]
  );

  const options = useMemo(() => {
    return { consolidate: true, passive, capture };
  }, [capture, passive]);

  const { attach, detach } = useEventListener(element, 'scroll', handler, options);

  useEffect(() => {
    attach();
    return detach;
  }, [attach, detach]);

  return [scroll, event.current];
}

export default useScrollState;
