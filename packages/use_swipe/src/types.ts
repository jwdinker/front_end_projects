import { PHASES } from './constants';

export type SwipePhase = typeof PHASES[keyof typeof PHASES];

export type CanSwipe = boolean | ((nextState: SwipeState) => boolean);

export type SwipeableElement = React.RefObject<HTMLElement | null | undefined>;

export interface SwipeProps {
  wheel?: boolean;
  touch?: boolean;
  canSwipe?: CanSwipe;
}

export interface SwipeState {
  phase: SwipePhase;
  isSwiping: boolean;
  xy: number[];
  direction: number[];
  origin: number[];
  move: number[];
  current: number[];
}

export interface TouchStart {
  type: 'SET_TOUCH_START';
  payload: {
    phase: 'start';
    current: number[];
  };
}

export interface TouchMove {
  type: 'SET_TOUCH_MOVE';
  payload: {
    phase: 'move';
    current: number[];
  };
}

export interface TouchEnd {
  type: 'SET_TOUCH_END';
  payload: null;
}

export interface WheelStart {
  type: 'SET_WHEEL_START';
  payload: {
    delta: number[];
  };
}

export interface WheelMove {
  type: 'SET_WHEEL_MOVE';
  payload: {
    delta: number[];
  };
}

export interface WheelEnd {
  type: 'SET_WHEEL_END';
  payload: null;
}

export interface SetSwipe {
  type: 'SET_SWIPE';
  payload: {
    phase: SwipePhase;
    xy: number[];
  };
}

export type SwipeAction =
  | TouchStart
  | TouchMove
  | TouchEnd
  | WheelStart
  | WheelMove
  | WheelEnd
  | SetSwipe;

export type Coordinates = {
  x: number;
  y: number;
};
