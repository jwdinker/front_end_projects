import { angleToDirections } from '@jwdinker/angle-helpers';
import { PHASES } from './constants';
import {
  SetSwipe,
  SwipeAction,
  SwipeState,
  TouchStart,
  TouchMove,
  TouchEnd,
  WheelStart,
  WheelMove,
  WheelEnd,
} from './types';

export const INITIAL_STATE: SwipeState = {
  phase: PHASES.IDLE,
  isSwiping: false,
  xy: [0, 0],
  direction: [0, 0],
  current: [0, 0],
  origin: [0, 0],
  move: [0, 0],
};

const SET_TOUCH_START = 'SET_TOUCH_START';
const SET_TOUCH_MOVE = 'SET_TOUCH_MOVE';
const SET_TOUCH_END = 'SET_TOUCH_END';

const SET_WHEEL_START = 'SET_WHEEL_START';
const SET_WHEEL_MOVE = 'SET_WHEEL_MOVE';
const SET_WHEEL_END = 'SET_WHEEL_END';

const SET_SWIPE = 'SET_SWIPE';

export const setTouchStart = (current: number[]): TouchStart => ({
  type: SET_TOUCH_START,
  payload: {
    phase: PHASES.START,
    current,
  },
});

export const setTouchMove = (current: number[]): TouchMove => ({
  type: SET_TOUCH_MOVE,
  payload: {
    phase: PHASES.MOVE,
    current,
  },
});

export const setTouchEnd = (): TouchEnd => ({
  type: SET_TOUCH_END,
  payload: null,
});

export const setWheelStart = (delta: number[]): WheelStart => ({
  type: SET_WHEEL_START,
  payload: {
    delta,
  },
});

export const setWheelMove = (delta: number[]): WheelMove => ({
  type: SET_WHEEL_MOVE,
  payload: {
    delta,
  },
});

export const setWheelEnd = (): WheelEnd => ({
  type: SET_WHEEL_END,
  payload: null,
});

export const setSwipe = (x = 0, y = 0): SetSwipe => ({
  type: SET_SWIPE,
  payload: {
    phase: PHASES.IDLE,
    xy: [x, y],
  },
});

export function reducer(state = INITIAL_STATE, action: SwipeAction): SwipeState {
  if (action.type === SET_WHEEL_START) {
    const { xy } = state;

    return {
      ...state,
      phase: PHASES.START,
      xy: xy.map((value, index) => value + action.payload.delta[index]),
      origin: state.xy,
      move: [0, 0],
    };
  }

  if (action.type === SET_WHEEL_MOVE) {
    const { xy } = state;

    const direction = action.payload.delta.map((v) => {
      return v > 0 ? 1 : v < 0 ? -1 : 0;
    });

    const nextXY = xy.map((value, index) => value + action.payload.delta[index]);

    return {
      ...state,
      phase: PHASES.MOVE,
      xy: nextXY,
      direction,
      move: state.origin.map((value, index) => {
        return nextXY[index] - value;
      }),
    };
  }

  if (action.type === SET_WHEEL_END) {
    return {
      ...state,
      phase: PHASES.END,
    };
  }

  if (action.type === SET_TOUCH_START) {
    return {
      ...state,
      ...action.payload,
      origin: action.payload.current,
      move: [0, 0],
    };
  }

  if (action.type === SET_TOUCH_MOVE) {
    const delta = state.current.map((value, index) => value - action.payload.current[index]);
    const xy = state.xy.map((value, index) => value + delta[index]);

    // delta's can be unreliable, use angles instead.
    const direction = angleToDirections(state.xy, xy);

    return {
      ...state,
      ...action.payload,
      xy,
      direction,
      move: action.payload.current.map((value, index) => {
        return state.origin[index] - value;
      }),
    };
  }

  if (action.type === SET_TOUCH_END) {
    return {
      ...state,
      phase: PHASES.END,
    };
  }

  if (action.type === SET_SWIPE) {
    const { xy } = action.payload;

    const direction = angleToDirections(state.xy, xy);

    const delta = state.xy.map((value, index) => {
      return value - xy[index];
    });

    return {
      ...state,
      ...action.payload,
      direction,
      // move will be from last computed location from event.
      move: state.xy.map((value, index) => {
        return value - delta[index];
      }),
    };
  }

  return state;
}
