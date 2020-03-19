import { useMemo } from 'react';
import {
  Rectangle,
  AbbreviatedRectangle,
  UsePreventOverflowOptions,
  UsePreventOverflowReturn,
} from './types';
import { reduceSides } from './helpers';
import { DEFAULT_SIDES } from './constants';

/**
 *
 * @param element The top, left, height, width values used to compare agaist the
 * boundaries.
 * @param boundaries The top, bottom, left, and right values used to constrain
 * the element.
 * @param options An object containing the optional sides at which the overflow
 * is prevented and the optional padding that is applied to the boundary.
 */
function usePreventOverflow(
  element: Rectangle | AbbreviatedRectangle,
  boundaries: Rectangle,
  { sides = DEFAULT_SIDES, padding = {} }: UsePreventOverflowOptions = {}
): UsePreventOverflowReturn {
  const prevent = useMemo(() => {
    return reduceSides((side) => sides.indexOf(side) > -1);
  }, [sides]);

  const _padding = useMemo(() => {
    return reduceSides((side) => padding[side] || 0);
  }, [padding]);

  const overflowing = {
    top: false,
    left: false,
    right: false,
    bottom: false,
  };

  let { top, left } = element;

  if (prevent.top && element.top <= boundaries.top + _padding.top) {
    top = boundaries.top + _padding.top;
    overflowing.top = true;
  }

  if (prevent.bottom && element.top >= boundaries.bottom - element.height + _padding.bottom) {
    top = boundaries.bottom - element.height + _padding.bottom;
    overflowing.bottom = true;
  }

  if (prevent.left && element.left <= boundaries.left + _padding.left) {
    left = boundaries.left + _padding.left;
    overflowing.left = true;
  }

  if (prevent.right && element.left >= boundaries.right - element.width + _padding.right) {
    left = boundaries.right - element.width + _padding.right;
    overflowing.right = true;
  }

  const value = useMemo((): UsePreventOverflowReturn => {
    return [
      {
        ...element,
        top,
        left,
      },
      overflowing,
    ];
  }, [element, left, overflowing, top]);
  return value;
}

export default usePreventOverflow;
