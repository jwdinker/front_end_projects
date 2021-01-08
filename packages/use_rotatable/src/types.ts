export type Point = number[];

export type RotationDirection = -1 | 0 | 1;

export interface UseRotatableOptions {
  initialAngle?: number;
}

export interface UseRotatableState {
  isRotating: boolean;
  radians: number;
  totalRadians: number;
  direction: RotationDirection;
}

export type RotatableElement = React.RefObject<HTMLElement | undefined>;

export type SetRotationHandler = Function;

export type RotateTo = (degrees: number) => void;

export type StartRotation = (point: Point, center: Point) => void;
export type MoveRotation = (point: Point, center: Point) => void;
export type EndRotation = () => void;

export interface RotatableHandlers {
  start: StartRotation;
  move: MoveRotation;
  end: EndRotation;
  rotateTo: RotateTo;
}

export interface RotatableState {
  isRotating: boolean;
  degrees: number;
  direction: RotationDirection;
}

export type UseRotatableReturn = [RotatableState, RotatableHandlers];

export type UseRotatable = (initialAngle: number) => UseRotatableReturn;

export type RotateCallback = (point: Point, center: Point) => void;
