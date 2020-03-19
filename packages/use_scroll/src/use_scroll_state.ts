import { useState, useRef, useCallback, useMemo } from 'react';
import useTimeout from '@jwdinker/use-timeout';
import useEventListener from '@jwdinker/use-event-listener';

import usePrevious from '@jwdinker/use-previous';
import { DIRECTIONS, INITIAL_STATE } from './constants';
import { getDirection, getCoordinates } from './helpers';

import { ScrollStateOptions, ElementOrWindow, ScrollElement, UseScrollStateReturn } from './types';

function useScrollState(
  element: ScrollElement = null,
  { endDelay = 100, passive = false }: ScrollStateOptions = {}
): UseScrollStateReturn {
  const event = useRef<Event | null>(null);
  const [scroll, setScroll] = useState(() => INITIAL_STATE);
  const previous = usePrevious(scroll, INITIAL_STATE);

  const handleSetState = useCallback(
    (target: HTMLElement | Window, active = true) => {
      const coordinates = getCoordinates(target);
      setScroll({
        active,
        ...coordinates,
        direction: active
          ? getDirection(previous.left, previous.top, coordinates.left, coordinates.top)
          : DIRECTIONS.NONE,
      });
    },
    [previous.left, previous.top]
  );

  const getElement = useCallback(() => {
    if (element && 'current' in element) {
      return element.current;
    }
    return element;
  }, [element]);

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

  useEventListener(
    useMemo(
      () => ({
        target: element,
        type: 'scroll',
        handler,
        passive,
        consolidate: true,
      }),
      [element, handler, passive]
    )
  );

  return [scroll, event.current];
}

export default useScrollState;
