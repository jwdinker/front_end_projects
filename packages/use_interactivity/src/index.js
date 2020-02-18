import { useMemo, useCallback, useState } from 'react';

import usePrevious from '@jwdinker/use-previous';

import { calculateVelocity, getDirection, getPhase } from './helpers';

const initialState = {
  active: false,
  startTime: 0,
  origin: [0, 0],
  initial: [0, 0],
  previous: [0, 0],
  current: [0, 0],
  delta: [0, 0],
  move: [0, 0],
  distanceFromOrigin: [0, 0],
};

function useInteractivity() {
  const [state, setState] = useState(() => initialState);
  const wasActive = usePrevious(state.active, false);

  const handleStart = useCallback((x, y) => {
    setState(({ origin, current, delta, distanceFromOrigin }) => {
      return {
        active: true,
        startTime: Date.now(),
        origin: origin[0] === 0 && origin[1] === 0 ? [x, y] : origin,
        initial: [x, y],
        previous: current,
        current: [x, y],
        move: [0, 0],
        delta,
        distanceFromOrigin,
      };
    });
  }, []);

  const handleMove = useCallback((x, y) => {
    setState((currentState) => {
      const { origin, initial, current, move, distanceFromOrigin } = currentState;
      const currentMove = [x - initial[0], y - initial[1]];
      const delta = [currentMove[0] - move[0], currentMove[1] - move[1]];
      return {
        ...currentState,
        origin,
        initial,
        previous: current,
        current: [x, y],
        move: currentMove,
        delta,
        distanceFromOrigin: [distanceFromOrigin[0] + delta[0], distanceFromOrigin[1] + delta[1]],
      };
    });
  }, []);

  const handleEnd = useCallback(() => {
    setState((previousState) => {
      return {
        ...previousState,
        active: false,
      };
    });
  }, []);

  const handlers = useMemo(
    () => ({
      start: handleStart,
      move: handleMove,
      end: handleEnd,
    }),
    [handleEnd, handleMove, handleStart]
  );

  const {
    active,
    startTime,
    origin,
    initial,
    current,
    delta,
    move,
    previous,
    distanceFromOrigin,
  } = state;

  const currentTime = Date.now();
  const elaspedTime = currentTime - startTime;

  const phase = getPhase(wasActive, active);
  const velocity = move.map((value) => {
    return calculateVelocity(value, startTime, currentTime);
  });

  const currentDirection = getDirection(previous, current);
  const directionFromOrigin = getDirection(origin, current);

  const value = useMemo(() => {
    return {
      active,
      phase,
      direction: {
        current: currentDirection,
        fromOrigin: directionFromOrigin,
      },
      coordinates: {
        initial,
        origin,
        current,
        previous,
      },
      delta,
      time: {
        start: startTime,
        elapsed: elaspedTime,
        current: currentTime,
      },
      velocity,
      distance: {
        fromInitial: move,
        fromOrigin: distanceFromOrigin,
      },
    };
  }, [
    active,
    phase,
    currentDirection,
    directionFromOrigin,
    initial,
    origin,
    current,
    previous,
    delta,
    startTime,
    elaspedTime,
    currentTime,
    velocity,
    move,
    distanceFromOrigin,
  ]);

  return [value, handlers];
}

export default useInteractivity;
