export type Direction =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'forwards'
  | 'backwards'
  | 'clockwise'
  | 'counter_clockwise'
  | 'x'
  | 'y'
  | 'horizontal'
  | 'vertical'
  | 'north'
  | 'south'
  | 'east'
  | 'west'
  | 'none';

export interface DirectionTypes {
  NONE: Direction;
  UP: Direction;
  DOWN: Direction;

  LEFT: Direction;
  RIGHT: Direction;

  FORWARDS: Direction;
  BACKWARDS: Direction;

  CLOCKWISE: Direction;
  COUNTER_CLOCKWISE: Direction;

  X: Direction;
  Y: Direction;

  HORIZONTAL: Direction;
  VERTICAL: Direction;

  NORTH: Direction;
  SOUTH: Direction;
  EAST: Direction;
  WEST: Direction;
}

export type IsDirectionFunction = (direction: Direction) => boolean;

export type MakeDirectionCondition = (directionTypes: Direction[]) => IsDirectionFunction;

export interface ToDirection {
  none(): void;

  up(): void;
  down(): void;
  left(): void;
  right(): void;

  forwards(): void;
  backwards(): void;

  clockwise(): void;
  counterClockwise(): void;

  x(): void;
  y(): void;

  horizontal(): void;
  vertical(): void;

  north(): void;
  south(): void;
  east(): void;
  west(): void;
}

export type UseDirectionReturn = [Direction, ToDirection];
