export const PHASES = {
  IDLE: 'idle',
  NONE: 'none',
  START: 'start',
  MOVE: 'move',
  END: 'end',
  CANCELLED: 'cancelled',
} as const;

export const AXIS_TYPES = {
  X: 'x',
  Y: 'y',
  XY: 'xy',
} as const;

export const SCROLL_TIME_CONSTANT = 325;
export const ONE_SECOND = 1000;
