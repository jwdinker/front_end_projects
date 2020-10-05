import { Direction } from '@jwdinker/get-directions';

export type Point = [number, number];

export interface UseCoordinatesState {
  /**
   * The x,y coordinates at the start phase.
   */
  initial: Point;

  /**
   * The current x,y coordinates of the start and move phase.
   */
  current: Point;

  /**
   * previous x and y coordinate minutes the current x and y coordinate
   */
  delta: Point;

  /**
   * The x,y coordinates derived from the total distance traveled since the initial coordinate.  These coordinates
   * persist between coordinate events.
   *
   * distance = previous distance - previous coordinates - current coordinates
   */
  distance: Point;

  /**
   * The difference between the current and origin coordinates.
   */
  move: Point;

  /**
   * The current direction.
   *
   * index 0 (x axis):
   * -----------------
   * -1 for ←.
   *  1 for →.
   *  0 for no change.
   *
   *
   * index 1 (y axis):
   * -----------------
   * -1 for ↑.
   *  1 for ↓.
   *  0 for no change.
   *
   */
  direction: Direction[];
}

export type UseCoordinateHandler = (x: number, y: number) => void;

export interface UseCoordinateHandlers {
  start: UseCoordinateHandler;
  move: UseCoordinateHandler;
  end(): void;
  reset(): void;
}

export type UseCoordinateReturn = [UseCoordinatesState, UseCoordinateHandlers];
