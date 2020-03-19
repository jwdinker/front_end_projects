import { Direction, Element, ElementOrWindow } from './types';

export const getWindowScroll = () => ({
  left: window.pageXOffset || document.documentElement.scrollLeft,
  top: window.pageYOffset || document.documentElement.scrollTop,
});

export const getElementScroll = (target: HTMLElement) => {
  return { left: target.scrollLeft, top: target.scrollTop };
};

export const getCoordinates = (target: ElementOrWindow) => {
  if (target === window || target === document.body) {
    return getWindowScroll();
  }
  if (target instanceof HTMLElement) {
    return getElementScroll(target);
  }
  return {
    top: 0,
    left: 0,
  };
};

export const getDirection = (
  previousLeft: number,
  previousTop: number,
  currentLeft: number,
  currentTop: number
): Direction => {
  console.log('PREVIOUS DUDE', previousLeft, previousTop, currentLeft, currentTop);
  const isSameX = previousLeft === currentLeft;
  const isSameY = previousTop === currentTop;
  if (isSameY && isSameX) return 'none';

  if (!isSameY) {
    if (currentTop > previousTop) return 'down';
    return 'up';
  }

  if (currentLeft < previousLeft) return 'left';
  return 'right';
};

export const isRef = (element: any) => Object.hasOwnProperty.call('current', element);
