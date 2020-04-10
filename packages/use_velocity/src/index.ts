import { useState, useCallback, useMemo } from 'react';
import getDistanceFromPoints, { Point } from '@jwdinker/get-distance-from-points';
import {
  UseVelocityState,
  UseVelocityHandler,
  Velocity,
  CurrentPoint,
  StartState,
  UseVelocityHandlers,
  UseVelocityReturn,
} from './types';

export { UseVelocityState, UseVelocityReturn } from './types';

const getVelocity = (distance: number, startTime: number, endTime: number): number => {
  const denominator = endTime - startTime;
  if (Number.isNaN(denominator) || denominator === 0) {
    return 0;
  }

  return Math.abs(distance / denominator);
};

function useVelocity(): UseVelocityReturn {
  const [{ startTime, initial }, setStart] = useState<StartState>(() => ({
    startTime: 0,
    initial: [0, 0],
  }));

  const [current, setCurrent] = useState<CurrentPoint>(() => [0, 0] as Point);

  const start = useCallback<UseVelocityHandler>((x, y) => {
    const point = [x, y] as Point;
    setStart(() => ({
      startTime: Date.now(),
      initial: point,
    }));

    setCurrent(point);
  }, []);

  const move = useCallback<UseVelocityHandler>((x, y) => {
    setCurrent([x, y]);
  }, []);

  const state = useMemo((): UseVelocityState => {
    const distance = getDistanceFromPoints(current, initial);
    const now = startTime === 0 ? 0 : Date.now();
    const velocity = distance.map((axis) => {
      return getVelocity(axis, startTime, now);
    }) as Velocity;

    return {
      duration: now - startTime,
      velocity,
    };
  }, [current, initial, startTime]);

  const handlers = useMemo(
    (): UseVelocityHandlers => ({
      start,
      move,
    }),
    [move, start]
  );

  const value = useMemo((): UseVelocityReturn => {
    return [state, handlers];
  }, [handlers, state]);

  return value;
}

export default useVelocity;
