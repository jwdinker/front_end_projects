import { PHASES } from './constants';

export type DragPhase = typeof PHASES[keyof typeof PHASES];

export type DragEvent = globalThis.TouchEvent | globalThis.MouseEvent;

export type Coordinates = number[];
export type Direction = 1 | 0 | -1;
export type Directions = [Direction, Direction];

export interface DragState {
  isDragging: boolean;
  phase: DragPhase;
  initial: Coordinates;
  origin: Coordinates;
  delta: Coordinates;
  xy: Coordinates;
  translate: Coordinates;
  move: Coordinates;
  direction: Directions;
}

export type CanDrag = (dragState: DragState, event: DragEvent) => boolean;

export interface UseDragProps {
  touch?: boolean;
  mouse?: boolean;
  canDrag?: CanDrag;
  initialTranslate?: Coordinates;
  passive?: boolean;
  capture?: boolean;
}

export interface DragStart {
  type: 'DRAG_START';
  payload: {
    xy: Coordinates;
  };
}

export interface DragMove {
  type: 'DRAG_MOVE';
  payload: {
    xy: Coordinates;
  };
}

export interface DragEnd {
  type: 'DRAG_END';
  payload: null;
}

export interface DragTo {
  type: 'DRAG_TO';
  payload: {
    destination: Coordinates;
  };
}

export type DragAction = DragStart | DragMove | DragEnd | DragTo;

export type SetXY = (destination: Coordinates) => void;

export type DragReturn = [DragState, SetXY];
