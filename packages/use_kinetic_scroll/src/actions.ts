import getDirections from '@jwdinker/get-directions';

import { InteractionType, INTERACTION_TYPES } from '@jwdinker/make-get-interaction-type';
import { PHASES, EVENT_TYPES, DEVICE_PIXEL_RATIO, FRAME_RATE } from './constants';
import {
  add,
  subtract,
  multiply,
  getVelocity,
  divide,
  updateHistory,
  getPointerVelocity,
} from './helpers';
import {
  KineticScrollAction,
  KineticScrollState,
  PointerStart,
  PointerMove,
  PointerEnd,
  MomentumStart,
  MomentumMove,
  MomentumEnd,
  Snap,
  WheelStart,
  WheelMove,
  WheelEnd,
  ScrollToCoordinates,
  EventType,
} from './types';

export const INITIAL_STATE: KineticScrollState = {
  active: false,
  type: INTERACTION_TYPES.DORMANT,
  interactionPhase: PHASES.IDLE,
  momentumPhase: PHASES.IDLE,
  direction: [0, 0],
  origin: [0, 0],
  xy: [0, 0],
  delta: [0, 0],
  velocity: [0, 0],
  amplitude: [0, 0],
  coordinates: [0, 0],
  destination: [0, 0],
  timestamp: 0,
  boundaries: [
    [0, 0],
    [0, 0],
  ],
  history: [],
};

const POINTER_START = 'POINTER_START';
const POINTER_MOVE = 'POINTER_MOVE';
const POINTER_END = 'POINTER_END';

const MOMENTUM_START = 'MOMENTUM_START';
const MOMENTUM_MOVE = 'MOMENTUM_MOVE';
const MOMENTUM_END = 'MOMENTUM_END';

const WHEEL_START = 'WHEEL_START';
const WHEEL_MOVE = 'WHEEL_MOVE';
const WHEEL_END = 'WHEEL_END';

const SNAP = 'SNAP';

const SCROLL_TO_COORDINATES = 'SCROLL_TO_COORDINATES';

const COORDINATE_RESET = [0, 0];

export const pointerStart = (coordinates: number[], type: EventType): PointerStart => {
  return {
    type: POINTER_START,
    payload: {
      active: true,
      type,
      interactionPhase: PHASES.START,
      origin: coordinates,
      coordinates,
      amplitude: COORDINATE_RESET,
      destination: COORDINATE_RESET,
    },
  };
};

export const pointerMove = (coordinates: number[]): PointerMove => {
  return {
    type: POINTER_MOVE,
    payload: {
      coordinates,
      interactionPhase: PHASES.MOVE,
      momentumPhase: PHASES.IDLE,
    },
  };
};

export const pointerEnd = (damping: number): PointerEnd => {
  return {
    type: POINTER_END,
    payload: {
      damping,
    },
  };
};

export const wheelStart = (event: WheelEvent): WheelStart => {
  const { deltaX, deltaY, pageX, pageY } = event;
  const coordinates = [pageX, pageY];
  const delta = [deltaX, deltaY];
  return {
    type: WHEEL_START,
    payload: {
      active: true,
      type: EVENT_TYPES.WHEEL,
      interactionPhase: PHASES.START,
      coordinates,
      origin: coordinates,
      delta,
      velocity: COORDINATE_RESET,
      amplitude: COORDINATE_RESET,
      destination: COORDINATE_RESET,
      timestamp: Date.now(),
    },
  };
};

export const wheelMove = (delta: number[]): WheelMove => {
  return {
    type: WHEEL_MOVE,
    payload: {
      delta,
      interactionPhase: PHASES.MOVE,
    },
  };
};

export const wheelEnd = (damping: number): WheelEnd => {
  return {
    type: WHEEL_END,
    payload: {
      active: false,
      interactionPhase: PHASES.END,
      damping,
    },
  };
};

export const snap = (destination: number[]): Snap => {
  return {
    type: SNAP,
    payload: {
      destination,
    },
  };
};

export const momentumStart = (): MomentumStart => {
  return {
    type: MOMENTUM_START,
    payload: {
      active: true,
      interactionPhase: PHASES.IDLE,
      momentumPhase: PHASES.START,
      timestamp: Date.now(),
    },
  };
};

export const momentumMove = (decay: number[]): MomentumMove => {
  return {
    type: MOMENTUM_MOVE,
    payload: {
      momentumPhase: PHASES.MOVE,
      decay,
    },
  };
};

export const momentumEnd = (): MomentumEnd => {
  return {
    type: MOMENTUM_END,
    payload: {
      active: false,
      momentumPhase: PHASES.END,
      velocity: [0, 0],
    },
  };
};

export const scrollToCoordinates = (destination: number[]): ScrollToCoordinates => {
  return {
    type: SCROLL_TO_COORDINATES,
    payload: {
      active: true,
      momentumPhase: PHASES.START,
      destination,
    },
  };
};

export function reducer(state = INITIAL_STATE, action: KineticScrollAction): KineticScrollState {
  if (action.type === POINTER_START) {
    const now = Date.now();
    return {
      ...state,
      ...action.payload,
      velocity: [0, 0],
      timestamp: now,
      history: [[now, action.payload.coordinates]],
    };
  }

  if (action.type === POINTER_MOVE) {
    const now = Date.now();
    const delta = subtract(state.coordinates, action.payload.coordinates);
    const xy = add(state.xy, delta);

    return {
      ...state,
      ...action.payload,
      delta,
      xy,
      direction: getDirections(state.coordinates, action.payload.coordinates),
      timestamp: now,
      history: updateHistory(state.history, now, action.payload.coordinates),
    };
  }

  if (action.type === POINTER_END) {
    const { damping } = action.payload;
    const now = Date.now();
    const velocity = getPointerVelocity(state.history);
    const amplitude = multiply(velocity, damping);
    const destination = add(state.xy, amplitude);

    return {
      ...state,
      active: false,
      interactionPhase: PHASES.END,
      velocity,
      amplitude,
      destination,
      timestamp: now,
    };
  }

  if (action.type === SNAP) {
    const { destination } = action.payload;
    const now = Date.now();
    return {
      ...state,
      active: true,
      interactionPhase: PHASES.IDLE,
      momentumPhase: PHASES.START,
      destination,
      amplitude: subtract(destination, state.xy),
      timestamp: now,
    };
  }

  if (action.type === MOMENTUM_START) {
    return {
      ...state,
      ...action.payload,
    };
  }

  if (action.type === MOMENTUM_MOVE) {
    const { momentumPhase } = action.payload;
    const xy = add(state.destination, action.payload.decay);

    return {
      ...state,
      momentumPhase,
      xy: xy.map((value: number) => Math.floor(value * 100) / 100),
    };
  }

  if (action.type === MOMENTUM_END) {
    return {
      ...state,
      ...action.payload,
      velocity: [0, 0],
    };
  }

  if (action.type === WHEEL_START) {
    return {
      ...state,
      ...action.payload,
      origin: action.payload.origin,
      xy: add(state.xy, action.payload.delta),
    };
  }

  if (action.type === WHEEL_MOVE) {
    const now = Date.now();
    const { coordinates } = state;
    const { delta } = action.payload;
    const velocity = getVelocity(state.velocity, state.delta, now - state.timestamp);
    const xy = add(state.xy, action.payload.delta);
    const newCoord = subtract(xy, state.xy);

    return {
      ...state,
      interactionPhase: PHASES.MOVE,
      delta,
      coordinates: add(coordinates, newCoord),
      xy,
      velocity,
      timestamp: now,
    };
  }

  if (action.type === WHEEL_END) {
    const { interactionPhase, active, damping } = action.payload;
    const now = Date.now();
    const velocity = getVelocity(state.velocity, state.delta, now - state.timestamp);
    const amplitude = multiply(velocity, damping);
    const destination = add(state.xy, amplitude);

    return {
      ...state,
      active,
      interactionPhase,
      velocity,
      amplitude,
      destination,
      timestamp: now,
    };
  }

  if (action.type === SCROLL_TO_COORDINATES) {
    return {
      ...state,
      ...action.payload,
      amplitude: subtract(action.payload.destination, state.xy),
      timestamp: Date.now(),
    };
  }

  return state;
}
