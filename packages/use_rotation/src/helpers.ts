import { _2_PI } from './constants';
import { Point, RotationEvent, GetElementReturn, RotatableElement } from './types';

export const is = {
  start: (eventName: string): boolean => eventName === 'touchstart' || eventName === 'mousedown',
  move: (eventName: string): boolean => eventName === 'touchmove' || eventName === 'mousemove',
  end: (eventName: string): boolean => eventName === 'touchend' || eventName === 'mouseup',
};

export function getCenterCoordinate(element: HTMLElement): Point {
  return [
    element.offsetLeft + element.offsetWidth / 2,
    element.offsetTop + element.offsetHeight / 2,
  ];
}

function getCoordinatesFromTouch(touches: TouchList, index = 0): Point {
  return [touches[index].pageX, touches[index].pageY];
}

export function getSingleTouchCoordinates(touches: TouchList, element: HTMLElement): Point[] {
  const center = getCenterCoordinate(element);
  const point = getCoordinatesFromTouch(touches, 0);
  return [point, center];
}

export function getMultiTouchCoordinates(touches: TouchList): Point[] {
  return [getCoordinatesFromTouch(touches), getCoordinatesFromTouch(touches, 1)];
}

export function getMouseCoordinates(event: MouseEvent, element: HTMLElement): Point[] {
  const center = getCenterCoordinate(element);
  const { pageX, pageY } = event;
  return [[pageX, pageY], center];
}

export function getCoordinates(
  event: RotationEvent,
  element: HTMLElement,
  multiTouch = false
): Point[] {
  const touches = !!event && event instanceof TouchEvent ? event.touches : null;
  const isSingleTouch = !multiTouch && touches && touches.length === 1;
  const isMultiTouch = multiTouch && touches && touches.length > 1;
  const isMouse = !!event && event instanceof MouseEvent;
  return isMultiTouch
    ? getMultiTouchCoordinates(touches as TouchList)
    : isSingleTouch
    ? getSingleTouchCoordinates(touches as TouchList, element)
    : isMouse
    ? getMouseCoordinates(event as MouseEvent, element)
    : [
        [0, 0],
        [0, 0],
      ];
}

export function getElement(element: RotatableElement): GetElementReturn {
  return element && 'current' in element && element.current instanceof HTMLElement
    ? element.current
    : null;
}

export function makeRotationCoordinates(multiTouch = false) {
  return (event: RotationEvent): [Point | null, Point | null] => {
    const touches = !!event && event instanceof TouchEvent ? event.touches : null;
    if (touches) {
      const touch1: Point = [touches[0].pageX, touches[0].pageY];
      if (multiTouch) {
        if (touches.length > 1) {
          const touch2: Point = [touches[1].pageX, touches[1].pageY];
          return [touch1, touch2];
        }
      } else {
        return [touch1, null];
      }
    }

    if (!!event && event instanceof MouseEvent && !multiTouch) {
      const { pageX, pageY } = event;
      return [[pageX, pageY], null];
    }

    return [null, null];
  };
}

export const toDegrees = (radians: number): number => {
  const rotation = (radians * 180) / Math.PI;

  return rotation;
};

export function getRadians(point1: Point, point2: Point): number {
  const [x1, y1] = point1;
  const [x2, y2] = point2;

  const angle = Math.atan2(x2 - x1, y2 * -1 - y1 * -1);
  if (angle < 0) {
    return angle + _2_PI;
  }
  return angle;
}
