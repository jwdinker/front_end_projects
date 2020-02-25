import { DIRECTIONS } from './constants';

const { NONE, UP, DOWN, LEFT, RIGHT } = DIRECTIONS;

export const getWindowScroll = () => ({
  left: window.pageXOffset || document.documentElement.scrollLeft,
  top: window.pageYOffset || document.documentElement.scrollTop,
});

export const getElementScroll = (target) => {
  return { left: target.scrollLeft, top: target.scrollTop };
};

const isWindow = (target) => target === window || target === document || target === document.body;

export const getCoordinates = (target) => {
  if (isWindow(target)) {
    return getWindowScroll();
  }

  return getElementScroll(target);
};

export const getDirection = (previousLeft, previousTop, currentLeft, currentTop) => {
  const isSameX = previousLeft === currentLeft;
  const isSameY = previousTop === currentTop;
  if (isSameY && isSameX) return NONE;

  if (!isSameY) {
    if (currentTop > previousTop) return DOWN;
    return UP;
  }

  if (currentLeft < previousLeft) return LEFT;
  return RIGHT;
};
