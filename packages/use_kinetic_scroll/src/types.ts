import { RefObject } from 'react';
import { DragEvent } from '@jwdinker/use-drag-listener';
import { PHASES, AXIS_TYPES, EVENT_TYPES } from './constants';

export type KineticScrollPhase = typeof PHASES[keyof typeof PHASES];

export type AxisType = typeof AXIS_TYPES[keyof typeof AXIS_TYPES];

export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];

export type Coordinates = number[];
export type Velocity = Coordinates;
export type Amplitude = Coordinates;
export type HistoryItem = [number, Coordinates];

export interface KineticScrollState {
  active: boolean;
  interactionPhase: KineticScrollPhase;
  type: EventType;
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
  history: HistoryItem[];
}

export type CanScroll = (event: DragEvent) => boolean;

export interface KineticScrollProps {
  animate?: boolean;
  axis?: AxisType;
  bounded?: boolean;
  damping?: number;
  canScroll?: CanScroll;
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

export interface PointerStart {
  type: 'POINTER_START';
  payload: {
    active: boolean;
    type: EventType;
    interactionPhase: KineticScrollPhase;
    origin: number[];
    coordinates: number[];
    amplitude: number[];
    destination: number[];
  };
}

export interface PointerMove {
  type: 'POINTER_MOVE';
  payload: {
    momentumPhase: KineticScrollPhase;
    interactionPhase: KineticScrollPhase;
    coordinates: number[];
  };
}

export interface PointerEnd {
  type: 'POINTER_END';
  payload: {
    damping: number;
  };
}

export interface Snap {
  type: 'SNAP';
  payload: {
    destination: number[];
  };
}

export interface MomentumStart {
  type: 'MOMENTUM_START';
  payload: {
    active: boolean;
    interactionPhase: KineticScrollPhase;
    momentumPhase: KineticScrollPhase;
    timestamp: number;
  };
}

export interface MomentumMove {
  type: 'MOMENTUM_MOVE';
  payload: {
    momentumPhase: KineticScrollPhase;
    decay: number[];
  };
}

export interface MomentumEnd {
  type: 'MOMENTUM_END';
  payload: {
    active: boolean;
    momentumPhase: KineticScrollPhase;
    velocity: number[];
  };
}

export interface WheelStart {
  type: 'WHEEL_START';
  payload: {
    active: boolean;
    type: EventType;
    delta: number[];
    origin: number[];
    coordinates: number[];
    interactionPhase: KineticScrollPhase;
    velocity: number[];
    amplitude: number[];
    destination: number[];
    timestamp: number;
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
    damping: number;
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

export type KineticScrollAction =
  | PointerStart
  | PointerMove
  | PointerEnd
  | MomentumStart
  | Snap
  | MomentumMove
  | MomentumEnd
  | WheelStart
  | WheelMove
  | WheelEnd
  | ScrollToCoordinates;

export interface KineticScrollHandlers {
  thrust(): void;
  snapTo(x: number, y: number): void;
  scrollTo(x: number, y: number): void;
}

export type KineticScrollReturn = [KineticScrollState, KineticScrollHandlers];
