import { useState, useCallback, useMemo } from 'react';
import useDirection from '@jwdinker/use-direction';
import { UseRotatableReturn, UseRotatableOptions, Point } from './types';
import { getRadians, toDegrees } from './helpers';
import { _2_PI } from './constants';

function useRotatable({ initialAngle = 0 }: UseRotatableOptions = {}): UseRotatableReturn {
  const [direction, to] = useDirection();
  const [rotation, setRotation] = useState(() => ({
    angle: initialAngle,
    total: initialAngle,
  }));

  const start = useCallback((point: Point, center: Point) => {
    setRotation((previousState) => {
      const currentAngle = getRadians(center, point);

      return {
        ...previousState,
        active: true,
        angle: currentAngle,
      };
    });
  }, []);

  const move = useCallback(
    (point: Point, center: Point) => {
      setRotation(({ total, angle: previousAngle, ...state }) => {
        const currentAngle = getRadians(center, point);

        // This makes it so that (currentAngle + offset) is always within ±180 degrees of previous
        const offset = Math.round((previousAngle - currentAngle) / _2_PI) * _2_PI;
        const delta = currentAngle + offset - previousAngle;

        const nextRotationTotal = total + delta;

        if (nextRotationTotal !== total) {
          if (nextRotationTotal > total) {
            to.clockwise();
          } else {
            to.counterClockwise();
          }
        }

        return {
          ...state,
          angle: currentAngle,
          total: nextRotationTotal,
        };
      });
    },
    [to]
  );

  const end = useCallback(() => {
    to.none();
  }, [to]);

  const value = useMemo((): UseRotatableReturn => {
    return {
      ...rotation,
      direction,
      angle: toDegrees(rotation.angle),
      total: toDegrees(rotation.total),
      start,
      move,
      end,
    };
  }, [direction, end, move, rotation, start]);

  return value;
}

export default useRotatable;
