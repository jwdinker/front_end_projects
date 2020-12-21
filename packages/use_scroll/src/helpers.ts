import makeHasChanged from '@jwdinker/make-has-changed';
import easingFns from '@jwdinker/easing-fns';
import { AnimateScrollProps, ScrollCoordinates, ScrollElement, ScrollToCoord } from './types';
import { DIRECTION_TYPES, SCROLL_PROP_KEYS } from './constants';

export function getElement(element: ScrollElement) {
  return element && 'current' in element ? element.current : element;
}

export const getDirection = (previous: ScrollCoordinates, current: ScrollCoordinates): number => {
  let direction = 0;
  for (let i = 0; i < DIRECTION_TYPES.length; i += 1) {
    const key = DIRECTION_TYPES[i];
    const p = previous[key];
    const c = current[key];
    if (c > p) {
      direction = 1;
      break;
    }
    if (c < p) {
      direction = -1;
      break;
    }
  }
  return direction;
};

export const hasChanged = makeHasChanged(SCROLL_PROP_KEYS);
