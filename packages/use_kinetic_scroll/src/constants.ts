export const PHASES = {
  IDLE: 'idle',
  NONE: 'none',
  START: 'start',
  MOVE: 'move',
  END: 'end',
  STATIONARY: 'stationary',
  CANCELLED: 'cancelled',
} as const;

export const INERTIA_RESET = {
  phase: PHASES.NONE,
  xy: [0, 0],
  destination: [0, 0],
};

export const DEFAULT_STATE = {
  active: false,
  phases: {
    interaction: PHASES.IDLE,
    inertia: PHASES.IDLE,
  },
  direction: [0, 0],
  origin: [0, 0],
  xy: [0, 0],
  delta: [0, 0],
  velocity: [0, 0],
  amplitude: [0, 0],
  coordinates: [0, 0],
  destination: [0, 0],
  duration: 0,
  boundaries: [
    [0, 0],
    [0, 0],
  ],
};

export const AXIS_TYPES = {
  X: 'x',
  Y: 'y',
  XY: 'xy',
} as const;

export const KEYS_TO_RESET_ON_START = ['amplitude', 'velocity', 'delta', 'destination'] as const;
export const SCROLL_TIME_CONSTANT = 325;
export const ONE_SECOND = 1000;
