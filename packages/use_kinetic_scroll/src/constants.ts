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

export const EVENT_TYPES = {
  WHEEL: 'wheel',
  TOUCH: 'touch',
  MOUSE: 'mouse',
  DORMANT: 'dormant',
} as const;

export const SCROLL_TIME_CONSTANT = 325;
export const ONE_SECOND = 1000;

export const DEVICE_PIXEL_RATIO = typeof window !== 'undefined' ? window.devicePixelRatio : 1;

export const DECELERATION_RATE = {
  NORMAL: 0.998,
  FAST: 0.99,
};

export const FRAME_PROCESS_TIME = 6 / 10;

export const FRAME_RATE = 1000 / 60;
