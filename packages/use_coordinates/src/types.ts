export type Point = [number, number, number];

export type CoordinateDirection = 1 | -1 | 0;

export type CoordinateDirections = [CoordinateDirection, CoordinateDirection, CoordinateDirection];

export interface UseCoordinatesState {
  /**
   * The x,y,z coordinates at the start phase.
   */
  origin: Point;

  /**
   * The current x,y,z coordinates of the start and move phase.
   */
  current: Point;

  /**
   * The x,y,z coordinates derived from the total distance traveled since the initial coordinate.  These coordinates
   * persist between coordinate events.
   *
   * distance = previous distance - previous coordinates - current coordinates
   */
  distance: Point;

  /**
   * The difference between the current and origin coordinates.
   */
  change: Point;

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
   * index 2 (z axis):
   * -----------------
   * -1 ↘ backwards.
   *  1 ↖ forwards.
   *  0 for no change.
   */
  direction: CoordinateDirections;
}

export type UseCoordinateHandler = (x: number, y: number, z?: number) => void;

export interface UseCoordinateHandlers {
  start(x: number, y: number, z?: number): void;
  move(x: number, y: number, z?: number): void;
  end(): void;
}

export type UseCoordinateReturn = [UseCoordinatesState, UseCoordinateHandlers];
