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
  DragTo,
} from './types';

const DRAG_START = 'DRAG_START';
const DRAG_MOVE = 'DRAG_MOVE';
const DRAG_END = 'DRAG_END';
const DRAG_TO = 'DRAG_TO';

export function dragStart(xy: Coordinates): DragStart {
  return {
    type: DRAG_START,
    payload: {
      xy,
    },
  };
}

export function dragMove(xy: Coordinates): DragMove {
  return {
    type: DRAG_MOVE,
    payload: {
      xy,
    },
  };
}

export function dragEnd(): DragEnd {
  return {
    type: DRAG_END,
    payload: null,
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
  isDragging: false,
  phase: PHASES.IDLE,
  initial: [0, 0],
  origin: [0, 0],
  xy: [0, 0],
  delta: [0, 0],
  translate: [0, 0],
  move: [0, 0],
  direction: [0, 0],
};

export function reducer(state = INITIAL_STATE, action: DragAction): DragState {
  if (action.type === DRAG_START) {
    const { xy } = action.payload;
    const isInitial = state.initial.every((value) => value === 0);
    const initial = isInitial ? xy : state.initial;
    return {
      ...state,
      isDragging: true,
      phase: PHASES.START,
      initial,
      origin: xy,
      xy,
      move: [0, 0],
    };
  }

  if (action.type === DRAG_MOVE) {
    const { xy } = action.payload;

    const delta = state.xy.map((value, index) => value - xy[index]);
    const translate = state.translate.map((value, index) => value - delta[index]);
    const move = xy.map((value, index) => value - state.origin[index]);
    const direction = angleToDirections(state.move, move) as Directions;

    return {
      ...state,
      phase: PHASES.MOVE,
      delta,
      translate,
      xy,
      move,
      direction,
    };
  }

  if (action.type === DRAG_END) {
    return {
      ...state,
      isDragging: false,
      phase: PHASES.END,
      direction: [0, 0],
    };
  }

  if (action.type === DRAG_TO) {
    const { destination } = action.payload;

    return {
      ...state,
      phase: PHASES.IDLE,
      translate: destination,
    };
  }

  return state;
}
