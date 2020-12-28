import usePhaseableListener from '@jwdinker/use-phaseable-listener';
import useEventListener, { UseEventListenerReturn } from '@jwdinker/use-event-listener';
import useBlockScroll from '@jwdinker/use-block-scroll';
import * as React from 'react';

import { SwipeableElement, SwipeProps, SwipeState } from './types';
import {
  INITIAL_STATE,
  setWheelStart,
  setWheelMove,
  setWheelEnd,
  setSwipe,
  reducer,
  setTouchStart,
  setTouchMove,
  setTouchEnd,
} from './state';

import { getTouchCoordinates } from './helpers';

const { useState, useEffect } = React;

function useSwipe(container: SwipeableElement, props: SwipeProps = {}) {
  const { wheel = true, touch = true, canSwipe = true } = props;

  const [state, setState] = useState(INITIAL_STATE);

  const [block, unblock] = useBlockScroll(container, { axis: 'xy' });

  const isSwipeAllowed = (nextState: SwipeState): boolean => {
    return typeof canSwipe === 'function' ? canSwipe(nextState) : canSwipe;
  };

  const touchStart = (event: TouchEvent) => {
    const _event = event as TouchEvent;
    const coordinates = getTouchCoordinates(_event);
    // next state required for knowing when to block swiping.
    setState((previousState) => {
      const startState = reducer(previousState, setTouchStart(coordinates));
      if (isSwipeAllowed(startState)) {
        block();
        return startState;
      }
      return previousState;
    });
  };

  const touchMove = (event: TouchEvent) => {
    const coordinates = getTouchCoordinates(event);
    // next state required for knowing when to block swiping.
    setState((previousState) => {
      const moveState = reducer(previousState, setTouchMove(coordinates));
      if (isSwipeAllowed(moveState)) {
        return moveState;
      }
      return previousState;
    });
  };

  const touchEnd = () => {
    unblock();
    setState((previousState) => {
      return reducer(previousState, setTouchEnd());
    });
  };

  const delegator = (event: any) => {
    const { type } = event;
    if (type === 'touchstart') {
      return touchStart(event);
    }
    if (type === 'touchmove') {
      return touchMove(event);
    }
    return touchEnd();
  };

  const wheelStart = (event: WheelEvent) => {
    const { deltaX, deltaY } = event;
    setState((previousState) => {
      const startState = reducer(previousState, setWheelStart([deltaX, deltaY]));
      if (isSwipeAllowed(startState)) {
        return startState;
      }
      return previousState;
    });
  };

  const wheelMove = (event: WheelEvent) => {
    const { deltaX, deltaY } = event;
    setState((previousState) => {
      const moveState = reducer(previousState, setWheelMove([deltaX, deltaY]));
      if (isSwipeAllowed(moveState)) {
        return moveState;
      }
      return previousState;
    });
  };

  const wheelEnd = () => {
    setState((previousState) => reducer(previousState, setWheelEnd()));
  };

  const snapTo = ({ x = 0, y = 0 }) => {
    setState((previousState) => reducer(previousState, setSwipe(x, y)));
  };

  const wheelable = usePhaseableListener<WheelEvent>(container, {
    onStart: wheelStart,
    onMove: wheelMove,
    onEnd: wheelEnd,
    type: 'wheel',
    passive: true,
  });

  const touchable = useEventListener(container, 'touchstart touchmove touchend', delegator);

  useEffect(() => {
    const listeners: UseEventListenerReturn[] = [];
    if (wheel) {
      listeners.push(wheelable);
    }

    if (touch) {
      listeners.push(touchable);
    }

    listeners.forEach((listener) => {
      listener.attach();
    });
    return () => {
      listeners.forEach((listener) => {
        listener.detach();
      });
    };
  }, [touch, touchable, wheel, wheelable]);

  return [state, snapTo];
}

export default useSwipe;
