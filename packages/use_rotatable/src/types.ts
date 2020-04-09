import { RefObject } from 'react';

export type Point = number[];

export type RotationDirection = -1 | 0 | 1;

export interface UseRotatableOptions {
  initialAngle?: number;
}

export interface UseRotatableState {
  radians: number;
  totalRadians: number;
  direction: RotationDirection;
}

export type RotatableElement = RefObject<HTMLElement | undefined>;

export type SetRotationHandler = Function;

export interface UseRotatableHandlers {
  start(point: Point, center: Point): void;
  move(point: Point, center: Point): void;
  end(): void;
}

export interface UseRotatableReturnState {
  radians: number;
  angle: number;
  direction: RotationDirection;
}

export type UseRotatableReturn = [UseRotatableReturnState, UseRotatableHandlers];
