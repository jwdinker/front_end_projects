import { angleToDirections } from '@jwdinker/angle-helpers';
import { PHASES } from './constants';
import {
  DragState,
  DragAction,
  DragStart,
  Coordinates,
  DragMove,
  Directions,
  DragEnd,
  Velocity,
  DragTo,
} from './types';
import { getVelocity } from './helpers';

const DRAG_START = 'DRAG_START';
const DRAG_MOVE = 'DRAG_MOVE';
const DRAG_END = 'DRAG_END';
const DRAG_TO = 'DRAG_TO';

export function dragStart(currentXY: Coordinates, timestamp: number): DragStart {
  return {
    type: DRAG_START,
    payload: {
      currentXY,
      timestamp,
    },
  };
}

export function dragMove(
  currentXY: Coordinates,
  pressure = 0,
  duration: number,
  timestamp: number
): DragMove {
  return {
    type: DRAG_MOVE,
    payload: {
      currentXY,
      pressure,
      duration,
      timestamp,
    },
  };
}

export function dragEnd(duration: number): DragEnd {
  return {
    type: DRAG_END,
    payload: {
      duration,
    },
  };
}

export function dragTo(x = 0, y = 0): DragTo {
  return {
    type: DRAG_TO,
    payload: {
      destination: [x, y],
    },
  };
}

export const INITIAL_STATE: DragState = {
  active: false,
  phase: PHASES.IDLE,
  coordinates: {
    initial: [0, 0],
    origin: [0, 0],
    last: [0, 0],
    current: [0, 0],
    delta: [0, 0],
  },
  xy: [0, 0],
  move: [0, 0],
  pressure: 0,
  direction: [0, 0],
  velocity: [0, 0],
  duration: 0,
  timestamp: 0,
};

export function reducer(state = INITIAL_STATE, action: DragAction): DragState {
  if (action.type === DRAG_START) {
    const { currentXY, timestamp } = action.payload;
    const isInitial = state.coordinates.initial.every((value) => value === 0);
    const initial = isInitial ? currentXY : state.coordinates.initial;
    return {
      ...state,
      active: true,
      phase: PHASES.START,
      coordinates: {
        ...state.coordinates,
        initial,
        origin: currentXY,
        delta: state.coordinates.delta,
        current: currentXY,
      },
      move: [0, 0],
      velocity: [0, 0],
      duration: 0,
      timestamp,
    };
  }

  if (action.type === DRAG_MOVE) {
    const { currentXY, duration, timestamp } = action.payload;

    const delta = state.coordinates.current.map(
      (value, index) => value - currentXY[index]
    ) as Coordinates;

    const xy = state.xy.map((value, index) => value - delta[index]) as Coordinates;

    const move = currentXY.map(
      (value, index) => value - state.coordinates.origin[index]
    ) as Coordinates;

    const timeSinceLast = timestamp - state.timestamp;
    const velocity = xy.map((value) => getVelocity(value, timeSinceLast)) as Velocity;

    const direction = angleToDirections(state.move, move) as Directions;

    return {
      ...state,
      phase: PHASES.MOVE,
      coordinates: {
        ...state.coordinates,
        delta,
        last: delta,
        current: currentXY,
      },
      xy,
      move,
      direction,
      velocity,
      duration,
      timestamp,
    };
  }

  if (action.type === DRAG_END) {
    return {
      ...state,
      active: false,
      phase: PHASES.END,
      direction: [0, 0],
      duration: action.payload.duration,
      pressure: 0,
    };
  }

  if (action.type === DRAG_TO) {
    return {
      ...state,
      xy: action.payload.destination,
      phase: PHASES.IDLE,
    };
  }

  return state;
}
