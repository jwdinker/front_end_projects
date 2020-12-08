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

let rafId = 0;

export function animateScroll(props: AnimateScrollProps) {
  const { startCoord, endCoord, duration, easing, callback } = props;
  const time = Date.now();

  if (rafId) {
    window.cancelAnimationFrame(rafId);
  }

  function animate() {
    const elapsed = Math.max(1, Date.now() - time);

    const hasFinished = elapsed > duration;

    const coordinates: ScrollToCoord = SCROLL_PROP_KEYS.reduce(
      (accumulator, key, index) => {
        if (hasFinished) {
          accumulator[index] = Math.round(endCoord[key]);
        } else {
          const ease = easingFns[easing](elapsed / duration);
          const remaining = startCoord[key] + (endCoord[key] - startCoord[key]) * ease;

          accumulator[index] = Math.round(remaining);
        }
        return accumulator;
      },
      [0, 0]
    );

    callback(coordinates);

    if (elapsed > duration) {
      window.cancelAnimationFrame(rafId);
    } else {
      rafId = window.requestAnimationFrame(animate);
    }
  }
  animate();
}
