import { UseCoordinatesState } from '@jwdinker/use-coordinates/src';
import { UseVelocityState } from '@jwdinker/use-velocity/src';

export interface UseDragOptions {
  /**
   * Boolean indicating whether the mouse can trigger a drag event.
   */
  mouse?: boolean;
  /**
   * Number of touches that trigger a drag event.
   */
  touch?: number;

  /**
   * Initial x, y coordinates of the drag.
   */
  initial?: [number, number];
}

export interface UseDragReturn extends UseCoordinatesState, UseVelocityState {
  /**
   * Boolean indicating a drag is active.
   */
  isDragging: boolean;
  /**
   * Handler for manually setting the x,y coordinates of the rag.
   */
}
