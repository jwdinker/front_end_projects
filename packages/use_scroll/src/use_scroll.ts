import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import useTimeout from '@jwdinker/use-timeout';
import useEventListener from '@jwdinker/use-event-listener';

import { getScrollCoordinates } from '@jwdinker/scroll-helpers';
import { EASING_TYPES } from '@jwdinker/easing-fns';
import getDirections from '@jwdinker/get-directions';
import throttler from 'lodash.throttle';

import { smoothScroll, getVelocity, getDistance, isSameCoordinates } from './helpers';
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
  {
    endDelay = 45,
    passive = false,
    capture = false,
    once = false,
    onScroll = () => {},
  }: ScrollStateOptions = {}
): ScrollStateReturn {
  const initialSet = useRef(false);
  const event = useRef<Event | null>(null);
  const callback = useRef(onScroll);
  const [scroll, setScroll] = useState<ScrollState>(() => INITIAL_STATE);

  const _scroll = useRef(scroll);
  const previous = useRef<PreviousScrollCoordinates>([-1, -1]);
  const startTime = useRef(-1);
  _scroll.current = scroll;

  const getElement = useCallback(() => {
    if (element && 'current' in element) {
      return element.current;
    }
    return element;
  }, [element]);

  useEffect(() => {
    callback.current = onScroll;
  }, [onScroll]);

  const end = useCallback(() => {
    const _element = getElement();
    if (_element) {
      const { x, y } = getScrollCoordinates(_element);
      setScroll((previousScroll) => {
        const state = {
          ...previousScroll,
          phase: SCROLL_PHASES.END,
          x,
          y,
          isScrolling: false,
        };
        callback.current(state);
        return state;
      });
    }
  }, [getElement]);

  const [begin, clear] = useTimeout(end, endDelay);

  const start = useCallback((xy: number[]) => {
    const [x, y] = xy;

    startTime.current = Date.now();
    setScroll(() => {
      const state = {
        phase: SCROLL_PHASES.START,
        x,
        y,
        isScrolling: true,
        direction: getDirections(previous.current, xy),
        velocity: 0,
      };
      callback.current(state);
      return state;
    });
  }, []);

  // The previous state can't be used inside setScroll to determine direction
  // because the async nature of setState will cause the previous and current
  // scroll values to be the same...atleast it does when using hot module
  // replacement.
  const move = useCallback((xy: number[]) => {
    const [x, y] = xy;

    setScroll((previousScroll) => {
      const { velocity: previousVelocity } = previousScroll;
      const time = Date.now();

      const velocity = getVelocity(getDistance(xy, previous.current), startTime.current, time);
      const state = {
        ...previousScroll,
        phase: SCROLL_PHASES.MOVE,
        x,
        y,
        direction: getDirections(previous.current, xy),
        velocity: velocity > previousVelocity ? velocity : previousVelocity,
      };
      callback.current(state);
      return state;
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
      const { x, y } = getScrollCoordinates(currentTarget);
      const xy = [x, y];
      const isSame = isSameCoordinates(previous.current, xy);

      if (currentTarget && !isSame) {
        const { phase } = _scroll.current;
        clear();
        begin();
        switch (phase) {
          case SCROLL_PHASES.NONE:
          case SCROLL_PHASES.END: {
            return start(xy);
          }
          default: {
            return move(xy);
          }
        }
      }
      return undefined;
    },
    [begin, clear, move, start]
  );

  const options = useMemo(() => {
    return { consolidate: false, passive, capture, once };
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
      easing = EASING_TYPES.EASE_IN_CUBIC,
      duration = 350,
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
