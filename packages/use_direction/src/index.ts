import { useState, useMemo } from 'react';
import { DIRECTION_TYPES } from './constants';
import { Direction, ToDirection, UseDirectionReturn, MakeDirectionCondition } from './types';

export { DIRECTION_TYPES } from './constants';
export { Direction } from './types';

const { UP, DOWN, LEFT, RIGHT, X, Y, HORIZONTAL, VERTICAL } = DIRECTION_TYPES;

const VERTICAL_DIRECTIONS = [UP, DOWN, VERTICAL, Y];
const HORIZONTAL_DIRECTIONS = [LEFT, RIGHT, HORIZONTAL, X];

export const makeDirectionCondition: MakeDirectionCondition = (directionsTypes: Direction[]) => {
  return (direction: Direction): boolean => directionsTypes.some((type) => direction === type);
};

export const isHorizontal = makeDirectionCondition(HORIZONTAL_DIRECTIONS);
export const isVertical = makeDirectionCondition(VERTICAL_DIRECTIONS);

function useDirection(initial: Direction = DIRECTION_TYPES.NONE): UseDirectionReturn {
  const [direction, setDirection] = useState(initial);

  const to = useMemo((): ToDirection => {
    return Object.values(DIRECTION_TYPES).reduce((accumulator, key) => {
      const name = key === 'counter_clockwise' ? 'counterClockwise' : key;
      accumulator[name] = (): void => {
        setDirection(key);
      };
      return accumulator;
    }, {});
  }, []);

  const value = useMemo((): UseDirectionReturn => {
    return [direction, to];
  }, [direction, to]);

  return value;
}

export default useDirection;
