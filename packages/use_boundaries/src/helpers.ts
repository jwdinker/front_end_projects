import { ScrollState } from '@jwdinker/use-scroll';
import { WindowRectangle } from '@jwdinker/use-window-size';
import { OVERFLOW_VALUES } from './constants';
import { Boundaries } from './types';

export function isOverflowable(element: HTMLElement | Window): boolean {
  if (element === window) {
    return true;
  }
  const style = window.getComputedStyle(element as HTMLElement);

  return OVERFLOW_VALUES.some((property) => {
    const value = style.getPropertyValue(property);

    const isAuto = value === 'auto';
    const isScroll = value === 'scroll';

    return isAuto || isScroll;
  });
}

export const getScrollableAncestor = (reference: HTMLElement | Window): HTMLElement | Window => {
  if (reference !== window) {
    const parent = (reference as HTMLElement).parentNode as HTMLElement;

    const isBody = parent === document.body;
    if (!isBody) {
      return isOverflowable(parent) ? parent : getScrollableAncestor(parent);
    }
  }
  return window;
};

export function mergeViewportScrollWithWindowRect(
  values: WindowRectangle,
  scroll: ScrollState
): Boundaries {
  const { height, width } = values;
  const top = values.top + scroll.top;
  const left = values.left + scroll.left;
  return {
    top,
    left,
    right: left + width,
    bottom: top + height,
  };
}
