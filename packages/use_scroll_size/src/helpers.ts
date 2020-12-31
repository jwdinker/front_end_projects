import { GetDimensionsTarget, ScrollableElement, ScrollDimensions } from './types';

const SIZE_PROPS = ['height', 'width'];

export const hasDimensionChanged = <P, C>(previous: P, current: C): boolean =>
  SIZE_PROPS.some((prop) => previous[prop] !== current[prop]);

export function getDimensions(target: GetDimensionsTarget): ScrollDimensions {
  if (target === window || target === document || target === document.body) {
    return {
      height:
        (document.documentElement && document.documentElement.scrollHeight) ||
        document.body.scrollHeight,
      width:
        (document.documentElement && document.documentElement.scrollWidth) ||
        document.body.scrollWidth,
    };
  }
  if (target instanceof HTMLElement) {
    return {
      height: target.scrollHeight,
      width: target.scrollWidth,
    };
  }
  return {
    height: 0,
    width: 0,
  };
}

export function getElement(element: ScrollableElement) {
  return element && 'current' in element && element.current instanceof HTMLElement
    ? element.current
    : element instanceof HTMLElement || element === window
    ? element
    : null;
}
