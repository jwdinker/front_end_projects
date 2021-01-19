import usePhaseableListener from '@jwdinker/use-phaseable-listener';
import useBlockScroll from '@jwdinker/use-block-scroll';
import * as React from 'react';
import useDragListener from '@jwdinker/use-drag-listener';
import get1TouchCoordinates from '@jwdinker/get-1-touch-coordinates';

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

const { useState, useEffect } = React;

function useSwipe(container: SwipeableElement, props: SwipeProps = {}) {
  const { wheel = true, touch = true, canSwipe = true } = props;

  const [state, setState] = useState(INITIAL_STATE);

  const [block, unblock] = useBlockScroll(container, { axis: 'xy' });

  const isSwipeAllowed = (nextState: SwipeState): boolean => {
    return typeof canSwipe === 'function' ? canSwipe(nextState) : canSwipe;
  };

  const snapTo = ({ x = 0, y = 0 }) => {
    setState((previousState) => reducer(previousState, setSwipe(x, y)));
  };

  const wheelable = usePhaseableListener<WheelEvent>(container, {
    onStart: (event) => {
      const { deltaX, deltaY } = event;
      setState((previousState) => {
        const startState = reducer(previousState, setWheelStart([deltaX, deltaY]));
        if (isSwipeAllowed(startState)) {
          return startState;
        }
        return previousState;
      });
    },
    onMove: (event) => {
      const { deltaX, deltaY } = event;
      setState((previousState) => {
        const moveState = reducer(previousState, setWheelMove([deltaX, deltaY]));
        if (isSwipeAllowed(moveState)) {
          return moveState;
        }
        return previousState;
      });
    },
    onEnd: () => {
      setState((previousState) => reducer(previousState, setWheelEnd()));
    },
    type: 'wheel',
    passive: true,
  });

  useDragListener(container, {
    onTouchStart: (event, enableMove) => {
      const coordinates = get1TouchCoordinates(event);
      // next state required for knowing when to block swiping.
      setState((previousState) => {
        const startState = reducer(previousState, setTouchStart(coordinates));
        if (isSwipeAllowed(startState)) {
          enableMove();
          block();
          return startState;
        }
        return previousState;
      });
    },
    onTouchMove: (event) => {
      const coordinates = get1TouchCoordinates(event);
      // next state required for knowing when to block swiping.
      setState((previousState) => {
        const moveState = reducer(previousState, setTouchMove(coordinates));
        if (isSwipeAllowed(moveState)) {
          return moveState;
        }
        return previousState;
      });
    },
    onTouchEnd: (event, disableMove) => {
      unblock();
      disableMove();
      setState((previousState) => {
        return reducer(previousState, setTouchEnd());
      });
    },
    touch,
    mouse: false,
  });

  useEffect(() => {
    if (wheel) {
      wheelable.attach();
      return wheelable.detach;
    }
    return undefined;
  }, [wheel, wheelable]);

  return [state, snapTo];
}

export default useSwipe;
