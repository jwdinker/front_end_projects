import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import useTimeout from '@jwdinker/use-timeout';
import useEventListener from '@jwdinker/use-event-listener';

import { getScrollCoordinates } from '@jwdinker/scroll-helpers';
import { EASING_TYPES } from '@jwdinker/easing-fns';
import getDirections from '@jwdinker/get-directions';

import { smoothScroll, getVelocity, getDistance } from './helpers';
import {
  ScrollStateOptions,
  ScrollElement,
  PreviousScrollCoordinates,
  ScrollState,
  ScrollStateReturn,
  ScrollToProps,
} from './types';
import { SCROLL_PHASES } from './constants';

const INITIAL_STATE: ScrollState = {
  phase: SCROLL_PHASES.NONE,
  isScrolling: false,
  x: 0,
  y: 0,
  direction: [0, 0],
  velocity: 0,
};

function useScroll(
  element: ScrollElement = null,
  { endDelay = 100, passive = false, capture = false, once = false }: ScrollStateOptions = {}
): ScrollStateReturn {
  const initialSet = useRef(false);
  const event = useRef<Event | null>(null);

  const [scroll, setScroll] = useState<ScrollState>(() => INITIAL_STATE);

  const _scroll = useRef(scroll);
  const previous = useRef<PreviousScrollCoordinates>([0, 0]);
  const startTime = useRef(-1);
  _scroll.current = scroll;

  const getElement = useCallback(() => {
    if (element && 'current' in element) {
      return element.current;
    }
    return element;
  }, [element]);

  const end = useCallback(() => {
    const _element = getElement();
    if (_element) {
      const { x, y } = getScrollCoordinates(_element);
      setScroll((previousScroll) => ({
        ...previousScroll,
        phase: SCROLL_PHASES.END,
        x,
        y,
        isScrolling: false,
        direction: [0, 0],
      }));
    }
  }, [getElement]);

  const [begin, clear] = useTimeout(end, endDelay);

  const start = useCallback((target: HTMLElement | Window) => {
    const { x, y } = getScrollCoordinates(target);
    const xy = [x, y];
    startTime.current = Date.now();
    setScroll({
      phase: SCROLL_PHASES.START,
      x,
      y,
      isScrolling: true,
      direction: getDirections(previous.current, xy),
      velocity: 0,
    });
  }, []);

  // The previous state can't be used inside setScroll to determine direction
  // because the async nature of setState will cause the previous and current
  // scroll values to be the same...atleast it does when using hot module
  // replacement.
  const move = useCallback((target: HTMLElement | Window) => {
    const { x, y } = getScrollCoordinates(target);
    const xy = [x, y];

    setScroll((previousScroll) => {
      const { velocity: previousVelocity } = previousScroll;
      const time = Date.now();

      const velocity = getVelocity(getDistance(xy, previous.current), startTime.current, time);
      return {
        ...previousScroll,
        phase: SCROLL_PHASES.MOVE,
        x,
        y,
        direction: getDirections(previous.current, xy),
        velocity: velocity > previousVelocity ? velocity : previousVelocity,
      };
    });
  }, []);

  // The initial values of the scroll are taken on the initial render because of the remote
  // possibility that the DOM scroll state is cached.
  useEffect(() => {
    const _element = getElement();

    if (_element && !initialSet.current) {
      setScroll((previousScroll) => ({
        ...previousScroll,
        ...getScrollCoordinates(_element),
      }));
      initialSet.current = true;
    }
  }, [end, getElement]);

  useEffect(() => {
    // A reference object has to be used instead of a usePrevious hook in order
    // to prevent rerenders on the initial measurements.  Otherwise, the scalars
    // destructured on the depenency array in handleSetState will trigger a
    // rerender and infinite loop.

    previous.current = [scroll.x, scroll.y];
  }, [scroll.x, scroll.y]);

  const handler = useCallback(
    (_event) => {
      event.current = _event;
      const { currentTarget } = _event;

      if (currentTarget) {
        _event.preventDefault();

        const { phase } = _scroll.current;
        clear();
        begin();
        switch (phase) {
          case SCROLL_PHASES.NONE:
          case SCROLL_PHASES.END: {
            return start(currentTarget);
          }
          default: {
            return move(currentTarget);
          }
        }
      }
    },
    [begin, clear, move, start]
  );

  const options = useMemo(() => {
    return { consolidate: true, passive, capture, once };
  }, [capture, once, passive]);

  const listener = useEventListener(element, 'scroll', handler, options);

  const handleScrollTo = useCallback(
    (x = 0, y = 0) => {
      const _element = getElement();
      if (_element) {
        _element.scrollTo(x, y);
      }
    },
    [getElement]
  );

  const scrollTo = useCallback(
    ({
      x = 0,
      y = 0,
      smooth = true,
      easing = EASING_TYPES.EASE_IN_OUT_QUINT,
      duration = 500,
    }: ScrollToProps = {}) => {
      const endCoordinates = { x, y };

      const _element = getElement();
      if (_element) {
        if (smooth) {
          const startCoordinates = getScrollCoordinates(_element);
          const args = {
            start: startCoordinates,
            end: endCoordinates,
            duration,
            easing,
          };
          smoothScroll(args, handleScrollTo);
        } else {
          handleScrollTo(endCoordinates.x, endCoordinates.y);
        }
      }
    },
    [getElement, handleScrollTo]
  );

  useEffect(() => {
    listener.attach();

    return listener.detach;
  }, [listener]);

  return [scroll, scrollTo, event.current];
}

export default useScroll;
