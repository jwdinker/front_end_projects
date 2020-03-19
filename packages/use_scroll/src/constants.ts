import { Direction, DirectionTypes } from './types';

export const DIRECTIONS: DirectionTypes = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
  NONE: 'none',
};

export const INITIAL_STATE = {
  active: false,
  top: 0,
  left: 0,
  direction: DIRECTIONS.NONE as Direction,
};
