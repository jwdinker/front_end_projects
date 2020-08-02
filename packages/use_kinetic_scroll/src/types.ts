import { RefObject } from 'react';
import { PHASES, AXIS_TYPES } from './constants';

export type KineticScrollPhase = typeof PHASES[keyof typeof PHASES];

export type AxisType = typeof AXIS_TYPES[keyof typeof AXIS_TYPES];

export type Coordinates = number[];
export type Velocity = Coordinates;
export type Amplitude = Coordinates;

export interface KineticScrollState {
  active: boolean;
  phases: {
    interaction: KineticScrollPhase;
    inertia: KineticScrollPhase;
  };
  direction: Coordinates;
  origin: Coordinates;
  xy: Coordinates;
  delta: Coordinates;
  velocity: Velocity;
  amplitude: Amplitude;
  coordinates: Coordinates;
  destination: Coordinates;
  duration: number;
  boundaries: number[][];
}

export type OnScroll = (state: KineticScrollState) => void;

export interface KineticScrollProps {
  animate?: boolean;
  axis?: AxisType;
  onScroll?: OnScroll;
}

export type KineticElement = RefObject<HTMLElement | undefined | null>;
