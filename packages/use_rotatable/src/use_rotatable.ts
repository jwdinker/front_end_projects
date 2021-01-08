import { useState, useCallback } from 'react';
import { getRadians, radiansToDegrees, degreesToRadians } from '@jwdinker/angle-helpers';
import { UseRotatableReturn, Point, RotationDirection } from './types';
import { getRotatableState } from './helpers';

function useRotatable(initialDegrees: number): UseRotatableReturn {
  const [state, setState] = useState(() => ({
    isRotating: false,
    radians: degreesToRadians(initialDegrees),
    totalRadians: degreesToRadians(initialDegrees),
    direction: 0 as RotationDirection,
  }));

  const rotateTo = useCallback((degrees: number) => {
    const radians = degreesToRadians(degrees);

    setState((previousState) => {
      return getRotatableState(previousState, radians);
    });
  }, []);

  const start = useCallback((point, center: Point) => {
    setState((previousState) => {
      const radians = getRadians(center, point);

      return {
        ...previousState,
        isRotating: true,
        radians,
      };
    });
  }, []);

  const move = useCallback((point: Point, center: Point) => {
    setState((previousState) => {
      const radians = getRadians(center, point);
      return getRotatableState(previousState, radians);
    });
  }, []);

  const end = useCallback(() => {
    setState((previousState) => ({
      ...previousState,
      isRotating: false,
      direction: 0,
    }));
  }, []);

  const { direction, totalRadians, isRotating } = state;

  return [
    {
      isRotating,
      direction,
      degrees: radiansToDegrees(totalRadians),
    },
    { start, move, end, rotateTo },
  ];
}

export default useRotatable;
