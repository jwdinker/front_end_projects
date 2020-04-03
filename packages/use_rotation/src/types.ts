import { RefObject } from 'react';
import { Direction } from '@jwdinker/use-direction';

export type Point = [number, number];

export interface UseRotatableOptions {
  initialAngle?: number;
}

export interface UseRotatableState {
  angle: number;
  total: number;
}

export type GetElementReturn = HTMLElement | null;

export type RotatableElement = RefObject<HTMLElement | undefined>;

export type RotationEvent = globalThis.TouchEvent | globalThis.MouseEvent;

export type SetRotationHandler = Function;

export interface UseRotatableHandlers {
  start(point: Point, center: Point): void;
  move(point: Point, center: Point): void;
  end(): void;
}

export interface UseRotatableReturn extends UseRotatableState, UseRotatableHandlers {
  direction: Direction;
}

export interface UseRotationOptions {
  initialAngle?: number;
  multiTouch?: boolean;
  mouse?: boolean;
  touch?: boolean;
}

export interface UseRotationReturn extends UseRotatableState {
  active: boolean;
  direction: Direction;
}
