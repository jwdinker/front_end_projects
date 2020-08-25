import getDirections from '@jwdinker/get-directions';
import { Dispatch, Store, GetState } from '@jwdinker/use-reducer-with-middleware';
import { PHASES } from './constants';
import { add, subtract, divide, multiply, getVelocity, hasMomentum } from './helpers';
import {
  KineticScrollAction,
  KineticScrollState,
  TouchStart,
  TouchMove,
  TouchEnd,
  MomentumStart,
  MomentumMove,
  MomentumEnd,
  EndPayload,
  SnapPayload,
  Snap,
  OnSnap,
  WheelStart,
  WheelMove,
  WheelEnd,
  ScrollToCoordinates,
} from './types';

export const INITIAL_STATE: KineticScrollState = {
  active: false,
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
};

const TOUCH_START = 'TOUCH_START';
const TOUCH_MOVE = 'TOUCH_MOVE';
const TOUCH_END = 'TOUCH_END';

const MOMENTUM_START = 'MOMENTUM_START';
const MOMENTUM_MOVE = 'MOMENTUM_MOVE';
const MOMENTUM_END = 'MOMENTUM_END';

const WHEEL_START = 'WHEEL_START';
const WHEEL_MOVE = 'WHEEL_MOVE';
const WHEEL_END = 'WHEEL_END';

const SNAP = 'SNAP';

const SCROLL_TO_COORDINATES = 'SCROLL_TO_COORDINATES';

const COORDINATE_RESET = [0, 0];

export const touchStart = (coordinates: number[]): TouchStart => {
  return {
    type: TOUCH_START,
    payload: {
      active: true,
      interactionPhase: PHASES.START,
      origin: coordinates,
      coordinates,
      velocity: COORDINATE_RESET,
      amplitude: COORDINATE_RESET,
      delta: COORDINATE_RESET,
      destination: COORDINATE_RESET,
    },
  };
};

export const touchMove = (coordinates: number[]): TouchMove => {
  return {
    type: TOUCH_MOVE,
    payload: {
      coordinates,
      interactionPhase: PHASES.MOVE,
      momentumPhase: PHASES.IDLE,
    },
  };
};

export const touchEnd = (payload: EndPayload): TouchEnd => {
  return {
    type: TOUCH_END,
    payload,
  };
};

export const wheelStart = (delta: number[]): WheelStart => {
  return {
    type: WHEEL_START,
    payload: {
      active: true,
      interactionPhase: PHASES.START,
      delta,
    },
  };
};

export const wheelMove = (delta: number[]): WheelMove => {
  return {
    type: WHEEL_MOVE,
    payload: {
      interactionPhase: PHASES.MOVE,
      delta,
    },
  };
};

export const wheelEnd = (): WheelEnd => {
  return {
    type: WHEEL_END,
    payload: {
      active: false,
      interactionPhase: PHASES.END,
    },
  };
};

export const momentumStart = (payload: EndPayload): MomentumStart => {
  return {
    type: MOMENTUM_START,
    payload,
  };
};

export const snap = (payload: SnapPayload): Snap => {
  return {
    type: SNAP,
    payload,
  };
};

export const momentumMove = (decay: number[]): MomentumMove => {
  return {
    type: MOMENTUM_MOVE,
    payload: {
      decay,
    },
  };
};

export const momentumEnd = (): MomentumEnd => {
  return {
    type: MOMENTUM_END,
    payload: null,
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

export const release = (onSnap: OnSnap, resistance: number) => {
  return (
    dispatch: Dispatch<KineticScrollAction>,
    getState: GetState<KineticScrollState>
  ): void => {
    const state = getState();
    const now = Date.now();

    const velocity = getVelocity(state.velocity, state.delta, now - state.timestamp);
    const amplitude = multiply(velocity, 1 - resistance);
    const destination = add(state.xy, amplitude);

    const payload = {
      velocity,
      amplitude,
      destination,
      timestamp: now,
    };

    const canThrust = hasMomentum(velocity);

    const snapDestination = onSnap && onSnap({ ...state, ...payload });
    const canSnap = canThrust && snapDestination;

    if (canSnap) {
      return dispatch(
        snap({
          velocity,
          destination: snapDestination as number[],
          timestamp: now,
        })
      );
    }

    if (canThrust) {
      return dispatch(momentumStart(payload));
    }

    return dispatch(touchEnd(payload));
  };
};

export function reducer(state = INITIAL_STATE, action: KineticScrollAction): KineticScrollState {
  if (action.type === TOUCH_START) {
    const now = Date.now();
    return {
      ...state,
      ...action.payload,
      timestamp: now,
    };
  }

  if (action.type === TOUCH_MOVE) {
    const now = Date.now();
    const delta = subtract(state.coordinates, action.payload.coordinates);
    const velocity = getVelocity(state.velocity, delta, now - state.timestamp);

    return {
      ...state,
      ...action.payload,
      delta,
      velocity,
      xy: add(state.xy, delta),
      direction: getDirections(state.coordinates, action.payload.coordinates),
      timestamp: now,
    };
  }

  if (action.type === TOUCH_END) {
    return {
      ...state,
      ...action.payload,
      active: false,
      interactionPhase: PHASES.END,
    };
  }

  if (action.type === SNAP) {
    const { destination } = action.payload;
    return {
      ...state,
      destination,
      amplitude: subtract(destination, state.xy),
      interactionPhase: PHASES.END,
      momentumPhase: PHASES.START,
    };
  }

  if (action.type === MOMENTUM_START) {
    return {
      ...state,
      ...action.payload,
      interactionPhase: PHASES.END,
      momentumPhase: PHASES.START,
    };
  }

  if (action.type === MOMENTUM_MOVE) {
    return {
      ...state,
      interactionPhase: PHASES.IDLE,
      momentumPhase: PHASES.MOVE,
      xy: add(state.destination, action.payload.decay),
    };
  }

  if (action.type === MOMENTUM_END) {
    return {
      ...state,
      active: false,
      momentumPhase: PHASES.END,
    };
  }

  if (action.type === WHEEL_START) {
    return {
      ...state,
      ...action.payload,
      xy: add(state.xy, action.payload.delta),
    };
  }

  if (action.type === WHEEL_MOVE) {
    return {
      ...state,
      ...action.payload,
      xy: add(state.xy, action.payload.delta),
    };
  }

  if (action.type === WHEEL_END) {
    return {
      ...state,
      ...action.payload,
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
