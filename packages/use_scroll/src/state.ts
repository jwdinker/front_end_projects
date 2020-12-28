import { ScrollCoordinates } from '@jwdinker/scroll-helpers';
import { SCROLL_PHASES } from './constants';
import { getDirection, hasChanged } from './helpers';

import { ScrollState } from './types';

export const INITIAL_STATE = {
  isScrolling: false,
  phase: SCROLL_PHASES.IDLE,
  x: 0,
  y: 0,
  direction: 0,
  isAnimating: false,
};

export function start(
  previousState: ScrollState,
  coordinates: ScrollCoordinates,
  isAnimating: boolean
): ScrollState {
  return {
    isScrolling: true,
    phase: SCROLL_PHASES.START,
    direction: getDirection(previousState, coordinates),
    isAnimating,
    ...coordinates,
  };
}

export function move(
  previousState: ScrollState,
  coordinates: ScrollCoordinates,
  isAnimating: boolean
): ScrollState {
  const haveCoordinatesChanged = hasChanged(previousState, coordinates);
  if (haveCoordinatesChanged) {
    return {
      isScrolling: true,
      phase: SCROLL_PHASES.MOVE,
      direction: getDirection(previousState, coordinates),
      isAnimating,
      ...coordinates,
    };
  }
  return previousState;
}

export function handleStartOrMove(
  previousState: ScrollState,
  coordinates: ScrollCoordinates,
  isAnimating: boolean
): ScrollState {
  if (!previousState.isScrolling) {
    return start(previousState, coordinates, isAnimating);
  }
  return move(previousState, coordinates, isAnimating);
}

export function stopAnimation(previousState: ScrollState): ScrollState {
  return {
    ...previousState,
    isAnimating: false,
  };
}

export function end(previousState: ScrollState, coordinates: ScrollCoordinates): ScrollState {
  return {
    ...previousState,
    isScrolling: false,
    phase: SCROLL_PHASES.END,
    isAnimating: false,
    direction: 0,
    ...coordinates,
  };
}
