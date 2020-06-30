import easingFns, { EasingType } from '@jwdinker/easing-fns';
import { SmoothScrollProps, SmoothScrollCallback } from './types';

const getPosition = (
  start: number,
  end: number,
  easing: EasingType,
  duration: number,
  elaspedTime: number
): number => {
  if (elaspedTime > duration) {
    return end;
  }
  return start + (end - start) * easingFns[easing](elaspedTime / duration);
};
/*
smoothScroll function adapted from Alice Lietieur
https://github.com/alicelieutier/smoothScroll
*/
export const smoothScroll = (
  props: SmoothScrollProps,
  callback: SmoothScrollCallback = () => {}
): void => {
  let rafId = 0;
  const { start, end, easing, duration } = props;
  const startTime = Date.now();

  const scroll = () => {
    const elaspedTime = Date.now() - startTime;
    callback(
      getPosition(start.x, end.x, easing, duration, elaspedTime),
      getPosition(start.y, end.y, easing, duration, elaspedTime)
    );

    if (elaspedTime > duration) {
      window.cancelAnimationFrame(rafId);
    } else {
      rafId = window.requestAnimationFrame(scroll);
    }
  };

  scroll();
};

const roundTo3rdDecimal = (number: number) => {
  return Math.round(number * 1000) / 1000;
};

export const getVelocity = (distance: number, startTime: number, endTime: number): number => {
  const denominator = endTime - startTime;
  if (Number.isNaN(denominator) || denominator === 0) {
    return 0;
  }

  return roundTo3rdDecimal(Math.abs(distance / denominator));
};

export const getDistance = (current: number[], previous: number[]): number => {
  const [x1, y1] = current;
  const [x2, y2] = previous;

  const isY = x1 === 0 && x2 === 0;

  const c = isY ? y1 : x1;
  const p = isY ? y2 : x2;
  const distance = Math.sqrt((Math.max(c, p) - Math.min(c, p)) ** 2);
  return distance;
};
