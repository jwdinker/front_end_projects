import { useState, useCallback, useMemo } from 'react';
import { getRadians, radiansToDegrees, TWO_PI, angleToRadians } from '@jwdinker/angle-helpers';
import { UseRotatableReturn, UseRotatableOptions, Point, RotationDirection } from './types';

export function isClockwise(direction: RotationDirection): boolean {
  return direction === 1;
}

export function isCounterClockwise(direction: RotationDirection): boolean {
  return direction === -1;
}

function useRotatable({ initialAngle = 0 }: UseRotatableOptions = {}): UseRotatableReturn {
  const [rotation, setRotation] = useState(() => ({
    radians: angleToRadians(initialAngle),
    totalRadians: angleToRadians(initialAngle),
    direction: 0 as RotationDirection,
  }));

  const start = useCallback((point: Point, center: Point) => {
    setRotation((previousState) => {
      const currentAngle = getRadians(center, point);

      return {
        ...previousState,
        active: true,
        radians: currentAngle,
      };
    });
  }, []);

  const move = useCallback((point: Point, center: Point) => {
    setRotation(({ totalRadians, radians: previousRadians, ...state }) => {
      const currentAngle = getRadians(center, point);

      // This makes it so that (currentAngle + offset) is always within ±180 degrees of previous
      const offset = Math.round((previousRadians - currentAngle) / TWO_PI) * TWO_PI;
      const delta = currentAngle + offset - previousRadians;

      const nextRotationTotal = totalRadians + delta;

      return {
        ...state,
        radians: currentAngle,
        totalRadians: nextRotationTotal,
        direction:
          nextRotationTotal === totalRadians ? 0 : nextRotationTotal > totalRadians ? 1 : -1,
      };
    });
  }, []);

  const end = useCallback(() => {
    setRotation((previousState) => ({
      ...previousState,
      direction: 0,
    }));
  }, []);

  const handlers = useMemo(() => {
    return {
      start,
      move,
      end,
    };
  }, [end, move, start]);

  const { direction, radians, totalRadians } = rotation;

  const value = useMemo((): UseRotatableReturn => {
    return [
      {
        direction,
        radians,
        angle: radiansToDegrees(totalRadians),
      },
      handlers,
    ];
  }, [direction, handlers, radians, totalRadians]);

  return value;
}

export default useRotatable;
