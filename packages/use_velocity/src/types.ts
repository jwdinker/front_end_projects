export type Velocity = [number, number, number];

export type Point = number[];

export interface StartState {
  startTime: number;
  initial: Point;
}

export type CurrentPoint = Point;

export type UseVelocityHandler = (x: number, y: number) => void;

export interface UseVelocityHandlers {
  start: UseVelocityHandler;
  move: UseVelocityHandler;
}

export interface UseVelocityState {
  duration: number;
  velocity: Velocity;
}

export type UseVelocityReturn = [UseVelocityState, UseVelocityHandlers];
