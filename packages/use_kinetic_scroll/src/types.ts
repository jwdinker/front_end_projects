import { RefObject } from 'react';
import { DragEvent } from '@jwdinker/use-drag-listener';
import { PHASES, AXIS_TYPES } from './constants';

export type KineticScrollPhase = typeof PHASES[keyof typeof PHASES];

export type AxisType = typeof AXIS_TYPES[keyof typeof AXIS_TYPES];

export type Coordinates = number[];
export type Velocity = Coordinates;
export type Amplitude = Coordinates;

export interface KineticScrollState {
  active: boolean;
  interactionPhase: KineticScrollPhase;
  momentumPhase: KineticScrollPhase;
  direction: Coordinates;
  origin: Coordinates;
  xy: Coordinates;
  delta: Coordinates;
  velocity: Velocity;
  amplitude: Amplitude;
  timestamp: number;
  coordinates: Coordinates;
  destination: Coordinates;
  boundaries: number[][];
}

export type OnScroll = (state: KineticScrollState) => void;
export type OnSnap = (state: KineticScrollState) => undefined | number[];
export type CanScroll = (event: DragEvent) => boolean;
export type OnMount = (state: KineticScrollState) => void;

export interface KineticScrollProps {
  animate?: boolean;
  axis?: AxisType;
  bounded?: boolean;
  resistance?: number;
  canScroll?: CanScroll;
  onScroll?: OnScroll;
  onSnap?: OnSnap;
  onMount?: OnMount;
  mouse?: boolean;
  touch?: boolean;
  wheel?: boolean;
  development?: boolean;
}

export type KineticElement = RefObject<HTMLElement | undefined | null>;

export interface EndPayload {
  velocity: number[];
  amplitude: number[];
  destination: number[];
  timestamp: number;
}

export interface SnapPayload {
  velocity: number[];
  destination: number[];
  timestamp: number;
}

export interface TouchStart {
  type: 'TOUCH_START';
  payload: {
    active: boolean;
    interactionPhase: KineticScrollPhase;
    origin: number[];
    coordinates: number[];
    velocity: number[];
    amplitude: number[];
    delta: number[];
    destination: number[];
  };
}

export interface TouchMove {
  type: 'TOUCH_MOVE';
  payload: {
    momentumPhase: KineticScrollPhase;
    interactionPhase: KineticScrollPhase;
    coordinates: number[];
  };
}

export interface TouchEnd {
  type: 'TOUCH_END';
  payload: EndPayload;
}

export interface Snap {
  type: 'SNAP';
  payload: SnapPayload;
}

export interface MomentumStart {
  type: 'MOMENTUM_START';
  payload: EndPayload;
}

export interface MomentumMove {
  type: 'MOMENTUM_MOVE';
  payload: {
    decay: number[];
  };
}

export interface MomentumEnd {
  type: 'MOMENTUM_END';
  payload: null;
}

export interface WheelStart {
  type: 'WHEEL_START';
  payload: {
    active: boolean;
    delta: number[];
    interactionPhase: KineticScrollPhase;
  };
}

export interface WheelMove {
  type: 'WHEEL_MOVE';
  payload: {
    delta: number[];
    interactionPhase: KineticScrollPhase;
  };
}

export interface WheelEnd {
  type: 'WHEEL_END';
  payload: {
    active: boolean;
    interactionPhase: KineticScrollPhase;
  };
}

export interface ScrollToCoordinates {
  type: 'SCROLL_TO_COORDINATES';
  payload: {
    active: boolean;
    momentumPhase: KineticScrollPhase;
    destination: number[];
  };
}

export type SnapInterjector = (snap: Snap, resistance: number) => {};

export type KineticScrollAction =
  | TouchStart
  | TouchMove
  | TouchEnd
  | MomentumStart
  | Snap
  | MomentumMove
  | MomentumEnd
  | WheelStart
  | WheelMove
  | WheelEnd
  | ScrollToCoordinates;

export interface KineticScrollHandlers {
  scrollTo(x: number, y: number): void;
}

export type KineticScrollReturn = [KineticScrollState, KineticScrollHandlers];
