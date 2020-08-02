import * as React from 'react';

import useDragListener, { DragCallback, DragEvent } from '@jwdinker/use-drag-listener';

import { PHASES, DEFAULT_STATE, KEYS_TO_RESET_ON_START, ONE_SECOND } from './constants';
import {
  KineticScrollPhase,
  KineticScrollState,
  Coordinates,
  Velocity,
  Amplitude,
  KineticScrollProps,
  KineticElement,
} from './types';

import {
  add,
  subtract,
  multiply,
  preventOverflow,
  canThrust,
  makeCoordinatesGetter,
  getBoundaries,
  getDecay,
  round,
  hasInertia,
} from './helpers';

const { useRef, useEffect } = React;

function useKineticScroll(
  container: KineticElement,
  { axis = 'y', animate = false, onScroll = () => {} }: KineticScrollProps = {}
): void {
  const timestamp = useRef(0);
  const startTime = useRef(0);
  const animationFrame = useRef(0);

  const state = useRef<KineticScrollState>(DEFAULT_STATE);

  const getCoordinates = makeCoordinatesGetter(axis);

  const setStartTime = (time: number): void => {
    startTime.current = time;
  };

  const getStartTime = (): number => {
    return startTime.current;
  };

  const setDuration = (time: number): void => {
    state.current.duration = time;
  };

  const setActive = (): void => {
    state.current.active = true;
  };

  const setInactive = (): void => {
    state.current.active = false;
  };

  const setInteractionPhase = (phase: KineticScrollPhase): void => {
    state.current.phases.interaction = phase;
  };

  const setInertiaPhase = (phase: KineticScrollPhase): void => {
    state.current.phases.inertia = phase;
  };

  const getInertiaPhase = (): KineticScrollPhase => {
    return state.current.phases.inertia;
  };

  const setTimestamp = (time: number): void => {
    timestamp.current = time;
  };

  const getTimestamp = () => {
    return timestamp.current;
  };

  const setCoordinates = (coordinates: Coordinates): void => {
    state.current.coordinates = coordinates;
  };

  const setOrigin = (coordinates: Coordinates): void => {
    state.current.origin = coordinates;
  };

  const setDelta = (coordinates: Coordinates, previousCoordinates: Coordinates): void => {
    const { delta } = state.current;
    subtract(delta, previousCoordinates, coordinates);
  };

  const setDirection = (coordinates: Coordinates, previousCoord: Coordinates): void => {
    const { direction } = state.current;
    coordinates.reduce((accumulator, currentCoordinate, index) => {
      const previousCoordinate = previousCoord[index];
      accumulator[index] =
        previousCoordinate !== currentCoordinate
          ? currentCoordinate > previousCoordinate
            ? -1
            : 1
          : 0;

      return accumulator;
    }, direction);
  };

  const setVelocity = (delta: Coordinates, elapsedTime: number): void => {
    const { velocity } = state.current;
    velocity.reduce((accumulator, previousVelocity, index) => {
      const currentVelocity = (ONE_SECOND * delta[index]) / (1 + elapsedTime); // 1 + elapsed to avoid dividing by zero
      accumulator[index] = 0.8 * currentVelocity + 0.2 * previousVelocity;
      return accumulator;
    }, velocity);
  };

  const setXY = (coordinates: Coordinates, delta: Coordinates): void => {
    const { xy, boundaries } = state.current;
    add(xy, coordinates, delta);
    preventOverflow(xy, boundaries, xy);
  };

  const setAmplitude = (velocity: Velocity): void => {
    const { amplitude } = state.current;
    multiply(amplitude, velocity, 0.8);
  };

  const setDestination = (xy: Coordinates, amplitude: Amplitude): void => {
    const { destination } = state.current;
    add(destination, xy, amplitude);
  };

  const resetCoordinates = (): void => {
    const _state = state.current;
    KEYS_TO_RESET_ON_START.forEach((key) => {
      _state[key] = [0, 0];
    });
  };

  const translate = (xy: Coordinates): void => {
    if (container && container.current instanceof HTMLElement) {
      const [x, y] = round(xy);
      // eslint-disable-next-line
      container.current.style.transform = `translate3d(${-x}px,${-y}px,0px)`;
    }
  };

  const clear = (): void => {
    if (animationFrame.current) {
      window.cancelAnimationFrame(animationFrame.current);
    }
  };

  const onTranslate = (): void => {
    if (animate) {
      translate(state.current.xy);
    }
  };

  const thrust = (): void => {
    const { amplitude, destination } = state.current;

    const now = Date.now();
    const duration = now - getTimestamp();
    const decay = getDecay(amplitude, duration);

    setDuration(now - getStartTime());

    if (canThrust(decay)) {
      setInteractionPhase(PHASES.IDLE);
      setInertiaPhase(PHASES.MOVE);
      setXY(destination, decay);
      onTranslate();
      animationFrame.current = window.requestAnimationFrame(thrust);
    } else {
      clear();
      setInactive();
      setInertiaPhase(PHASES.END);
    }
    onScroll(state.current);
  };

  const block = (event: DragEvent): boolean => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  const start: DragCallback = (event, listeners) => {
    listeners.listen();
    const coordinates = getCoordinates(event);
    clear();
    const now = Date.now();

    setActive();
    setInteractionPhase(PHASES.START);
    setInertiaPhase(getInertiaPhase() === PHASES.MOVE ? PHASES.CANCELLED : PHASES.IDLE);
    setCoordinates(coordinates);
    setOrigin(coordinates);
    resetCoordinates();
    setStartTime(now);

    onTranslate();
    onScroll(state.current);
    return block(event);
  };

  const move = (event: DragEvent): boolean => {
    const coordinates = getCoordinates(event);
    const now = Date.now();
    const elasped = now - getTimestamp();

    setInteractionPhase(PHASES.MOVE);
    setInertiaPhase(PHASES.IDLE);
    setDuration(now - getStartTime());
    setTimestamp(now);
    setDelta(coordinates, state.current.coordinates);
    setVelocity(state.current.delta, elasped);
    setDirection(coordinates, state.current.coordinates);

    setXY(state.current.xy, state.current.delta);
    setCoordinates(coordinates);

    onTranslate();
    onScroll(state.current);
    return block(event);
  };

  const end: DragCallback = (event, listeners) => {
    const { amplitude, velocity, xy, delta } = state.current;
    const now = Date.now();
    const duration = now - getTimestamp();

    setInteractionPhase(PHASES.END);
    setInertiaPhase(PHASES.START);
    setDuration(now - getStartTime());
    setTimestamp(now);
    setVelocity(delta, duration);
    setAmplitude(velocity);
    setDestination(xy, amplitude);

    if (hasInertia(velocity)) {
      animationFrame.current = window.requestAnimationFrame(thrust);
    }
    listeners.unlisten();
    return block(event);
  };

  useDragListener(container, { onStart: start, onMove: move, onEnd: end });

  useEffect(() => {
    if (container.current instanceof HTMLElement) {
      state.current.boundaries = getBoundaries(container.current);
    }
  }, [container]);

  useEffect(() => {
    return (): void => {
      clear();
      state.current = DEFAULT_STATE;
    };
  }, []);
}

export default useKineticScroll;
