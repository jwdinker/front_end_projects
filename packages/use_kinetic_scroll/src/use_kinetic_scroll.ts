import * as React from 'react';

import useDragListener, { DragCallback, DragEvent } from '@jwdinker/use-drag-listener';

import usePhaseableListener from '@jwdinker/use-phaseable-listener';
import throttler from 'lodash.throttle';
import useBlockScroll from '@jwdinker/use-block-scroll';
import { PHASES, DEVICE_PIXEL_RATIO } from './constants';
import {
  KineticScrollProps,
  KineticElement,
  KineticScrollReturn,
  KineticScrollState,
} from './types';

import {
  makeCoordinatesGetter,
  getDecay,
  canThrust,
  getInteractionType,
  add,
  divide,
  subtract,
} from './helpers';

import {
  reducer,
  INITIAL_STATE,
  pointerStart,
  pointerMove,
  pointerEnd,
  momentumMove,
  momentumEnd,
  wheelStart,
  wheelMove,
  wheelEnd,
  scrollToCoordinates,
  snap,
  momentumStart,
} from './actions';

const { useRef, useEffect, useCallback, useReducer, useMemo } = React;

function useKineticScroll(
  container: KineticElement,
  {
    canScroll = () => true,
    axis = 'y',
    bounded = true,
    damping = 0.6,
    mouse = false,
    touch = true,
    wheel = true,
  }: KineticScrollProps = {}
): KineticScrollReturn {
  const animationFrame = useRef(0);
  const isDecelerating = useRef(false);
  const previousDecay = useRef([0, 0]);

  const _damping = 1 - damping;
  const touchDamping = Math.max(_damping, 0.4);

  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const getCoordinates = useMemo(() => makeCoordinatesGetter(axis), [axis]);

  const _state = useRef<KineticScrollState>(state);
  _state.current = state;

  const clear = useCallback((): void => {
    if (animationFrame.current) {
      window.cancelAnimationFrame(animationFrame.current);
    }
  }, []);

  const preventDefault = (event: DragEvent): boolean => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  const progress = useCallback(() => {
    if (!isDecelerating.current) {
      return clear();
    }
    const { timestamp, amplitude } = _state.current;
    const now = Date.now();
    const duration = now - timestamp;

    const decay = getDecay(amplitude, duration);

    console.log('FUCK YOU: ', decay[1]);

    if (canThrust(decay)) {
      // const isSameDecay = decay.every(
      //   (value: number, index: number) => value === previousDecay.current[index]
      // );

      // if (!isSameDecay) {
      //   previousDecay.current = decay;
      dispatch(momentumMove(decay));
      // }
      animationFrame.current = window.requestAnimationFrame(progress);
    } else {
      clear();
      dispatch(momentumEnd());
    }
  }, [clear]);

  const [block, restore] = useBlockScroll(container);

  const start: DragCallback = (event, listeners) => {
    clear();
    if (canScroll(event)) {
      isDecelerating.current = false;
      block();
      listeners.listen();
      const coordinates = getCoordinates(event);
      dispatch(pointerStart(coordinates, getInteractionType(event)));
    }
  };

  const move = (event: DragEvent) => {
    const coordinates = getCoordinates(event);
    dispatch(pointerMove(coordinates));
  };

  const end: DragCallback = (event, listeners) => {
    restore();
    listeners.unlisten();

    dispatch(pointerEnd(touchDamping));
  };

  const onWheelStart = useCallback(
    (event: WheelEvent) => {
      clear();
      dispatch(wheelStart(event));
      return preventDefault(event);
    },
    [clear]
  );

  const onWheelMove = (event: WheelEvent) => {
    dispatch(wheelMove([event.deltaX, event.deltaY]));
    return preventDefault(event);
  };

  const onWheelEnd = (): void => {
    dispatch(wheelEnd(damping));
  };

  const scrollTo = useCallback(
    (x = 0, y = 0) => {
      dispatch(scrollToCoordinates([x, y]));
    },
    [dispatch]
  );

  const snapTo = useCallback(
    (x = 0, y = 0) => {
      dispatch(snap([x, y]));
    },
    [dispatch]
  );

  const thrust = useCallback(() => {
    dispatch(momentumStart());
  }, [dispatch]);

  useDragListener(container, {
    onStart: start,
    onMove: move,
    onEnd: end,
    touch,
    mouse,
    passive: false,
  });

  const wheelable = usePhaseableListener<WheelEvent>(container, {
    onStart: onWheelStart,
    onMove: onWheelMove,
    onEnd: onWheelEnd,
    type: 'wheel',
    passive: false,
  });

  useEffect(() => {
    if (wheel) {
      wheelable.attach();
      return wheelable.detach;
    }
    return undefined;
  }, [wheel, wheelable]);

  useEffect(() => {
    if (state.momentumPhase === PHASES.START) {
      isDecelerating.current = true;
      animationFrame.current = window.requestAnimationFrame(progress);
    }
    return undefined;
  }, [progress, state.momentumPhase]);

  useEffect(() => {
    return clear;
  }, [clear]);

  return [state, { scrollTo, snapTo, thrust }];
}

export default useKineticScroll;
