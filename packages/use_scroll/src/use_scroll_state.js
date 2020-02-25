import { useState, useRef, useCallback, useMemo } from 'react';
import useTimeout from '@jwdinker/use-timeout';
import useEventListener from '@jwdinker/use-event-listener';

import { DIRECTIONS } from './constants';
import { getDirection, getCoordinates } from './helpers';

function useScrollState(element, { endDelay = 100, passive = false } = {}) {
  const event = useRef();
  const [scroll, setScroll] = useState(() => {
    return {
      active: false,
      top: 0,
      left: 0,
      direction: DIRECTIONS.NONE,
      height: 0,
      width: 0,
    };
  });

  const handleSetState = useCallback((target, active = true) => {
    setScroll((previous) => {
      const coordinates = getCoordinates(target);
      return {
        active,
        ...coordinates,
        direction: getDirection(previous.left, previous.top, coordinates.left, coordinates.top),
      };
    });
  }, []);

  const end = useCallback(() => {
    return handleSetState(element.current || element, false);
  }, [element, handleSetState]);

  const [start, clear] = useTimeout(end, endDelay);

  const handler = useCallback(
    (_event) => {
      event.current = _event;
      const { target } = _event;
      clear();
      start();
      return handleSetState(target, true);
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
