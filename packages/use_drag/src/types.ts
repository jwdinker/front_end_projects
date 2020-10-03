import { DragEvent } from '@jwdinker/use-drag-listener';
import { PHASES } from './constants';

export type DragPhase = typeof PHASES[keyof typeof PHASES];

export type Coordinates = [number, number];
export type Direction = 1 | 0 | -1;
export type Directions = [Direction, Direction];
export type Velocity = [number, number];

export interface UseDragProps {
  touch?: 0 | 1 | 2;
  mouse?: boolean;
  canDrag?: (event: DragEvent) => boolean;
  initialCoordinates?: Coordinates;
  passive?: boolean;
  capture?: boolean;
}

export interface DragState {
  active: boolean;
  phase: DragPhase;
  coordinates: {
    initial: Coordinates;
    origin: Coordinates;
    last: Coordinates;
    delta: Coordinates;
    current: Coordinates;
  };
  xy: Coordinates;
  move: Coordinates;
  pressure: number;
  direction: Directions;
  velocity: Velocity;
  duration: number;
  timestamp: number;
}

export interface DragStart {
  type: 'DRAG_START';
  payload: {
    currentXY: Coordinates;
    timestamp: number;
  };
}

export interface DragMove {
  type: 'DRAG_MOVE';
  payload: {
    currentXY: Coordinates;
    pressure: number;
    duration: number;
    timestamp: number;
  };
}

export interface DragEnd {
  type: 'DRAG_END';
  payload: {
    duration: number;
  };
}

export type DragAction = DragStart | DragMove | DragEnd;
