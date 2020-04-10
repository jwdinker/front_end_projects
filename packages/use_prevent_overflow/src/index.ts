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
  { top = 0, left = 0, height = 0, width = 0 }: AbbreviatedRectangle,
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

  let topReplacement = top;
  let leftReplacement = left;

  if (prevent.top && top <= boundaries.top + _padding.top) {
    topReplacement = boundaries.top + _padding.top;
    overflowing.top = true;
  }

  if (prevent.bottom && top >= boundaries.bottom - height + _padding.bottom) {
    topReplacement = boundaries.bottom - height + _padding.bottom;
    overflowing.bottom = true;
  }

  if (prevent.left && left <= boundaries.left + _padding.left) {
    leftReplacement = boundaries.left + _padding.left;
    overflowing.left = true;
  }

  if (prevent.right && left >= boundaries.right - width + _padding.right) {
    leftReplacement = boundaries.right - width + _padding.right;
    overflowing.right = true;
  }

  const value = useMemo((): UsePreventOverflowReturn => {
    return [leftReplacement, topReplacement, overflowing];
  }, [leftReplacement, overflowing, topReplacement]);
  return value;
}

export default usePreventOverflow;
