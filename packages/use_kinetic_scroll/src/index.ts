import * as React from 'react';

import useDragListener, { DragCallback, DragEvent } from '@jwdinker/use-drag-listener';

import useReducerWithMiddleware, {
  logger,
  interjector,
} from '@jwdinker/use-reducer-with-middleware';

import usePhaseableListener from '@jwdinker/use-phaseable-listener';
import { PHASES } from './constants';
import {
  KineticScrollPhase,
  KineticScrollState,
  Coordinates,
  Velocity,
  Amplitude,
  KineticScrollProps,
  KineticElement,
  KineticScrollAction,
  KineticScrollReturn,
} from './types';

import { makeCoordinatesGetter, getDecay, canThrust, getDeltaFromWheel } from './helpers';

import {
  reducer,
  INITIAL_STATE,
  touchStart,
  touchMove,
  release,
  momentumMove,
  momentumEnd,
  wheelStart,
  wheelMove,
  wheelEnd,
  scrollToCoordinates,
} from './actions';

const { useRef, useEffect, useCallback, useMemo } = React;

function useKineticScroll(
  container: KineticElement,
  {
    axis = 'y',
    bounded = true,
    onMount = () => {},
    canScroll = () => true,
    onScroll = () => {},
    onSnap,
    resistance = 1,
    mouse = false,
    touch = true,
    wheel = true,
    development = false,
  }: KineticScrollProps = {}
): KineticScrollReturn {
  const animationFrame = useRef(0);
  const mounted = useRef(false);

  const middleware = useRef(development ? [logger, interjector] : [interjector]);

  const [state, dispatch] = useReducerWithMiddleware(reducer, INITIAL_STATE, middleware.current);
  const getCoordinates = makeCoordinatesGetter(axis);

  const clear = useCallback((): void => {
    if (animationFrame.current) {
      window.cancelAnimationFrame(animationFrame.current);
    }
  }, []);

  const block = (event: DragEvent): boolean => {
    event.preventDefault();
    // event.stopPropagation();
    return false;
  };

  const thrust = useCallback(() => {
    clear();
    const { timestamp, amplitude } = state;
    const now = Date.now();
    const duration = now - timestamp;
    const decay = getDecay(amplitude, duration);

    if (canThrust(decay)) {
      dispatch(momentumMove(decay));
      animationFrame.current = window.requestAnimationFrame(thrust);
    } else {
      dispatch(momentumEnd());
    }
  }, [clear, dispatch, state]);

  const start: DragCallback = (event, listeners) => {
    if (canScroll(event)) {
      listeners.listen();
      const coordinates = getCoordinates(event);
      clear();
      dispatch(touchStart(coordinates));
      return block(event);
    }
  };

  const move = (event: DragEvent) => {
    const coordinates = getCoordinates(event);
    dispatch(touchMove(coordinates));
    // return block(event);
  };

  const end: DragCallback = (event, listeners) => {
    listeners.unlisten();

    // @ts-ignore
    dispatch(release(onSnap, resistance));
    return block(event);
  };

  const onWheelStart = (event: WheelEvent): void => {
    dispatch(wheelStart(getDeltaFromWheel(event)));
  };

  const onWheelMove = (event: WheelEvent): void => {
    dispatch(wheelMove(getDeltaFromWheel(event)));
  };

  const onWheelEnd = () => {
    dispatch(wheelEnd());
  };

  const scrollTo = useCallback(
    (x = 0, y = 0) => {
      dispatch(scrollToCoordinates([x, y]));
    },
    [dispatch]
  );

  useDragListener(container, { onStart: start, onMove: move, onEnd: end, touch, mouse });

  const wheelable = usePhaseableListener<WheelEvent>(container, {
    onStart: onWheelStart,
    onMove: onWheelMove,
    onEnd: onWheelEnd,
    type: 'wheel',
  });

  useEffect(() => {
    if (wheel) {
      wheelable.attach();
      return wheelable.detach;
    }
  }, [wheel, wheelable]);

  useEffect(() => {
    if (state.momentumPhase === PHASES.START) {
      animationFrame.current = window.requestAnimationFrame(thrust);
    }
  }, [state.momentumPhase, thrust]);

  useEffect(() => {
    if (!mounted.current) {
      onMount(state);
      mounted.current = true;
    }
  }, [onMount, state]);

  useEffect(() => {
    if (state.active) {
      onScroll(state);
    }
  }, [onScroll, state]);

  useEffect(() => {
    return clear;
  }, [clear]);

  return [state, { scrollTo }];
}

export default useKineticScroll;
