// recursively combines offsets of all the parents
import { GetPositionReturn, Offsets } from './types';

export const getPosition = (node: HTMLElement): GetPositionReturn => {
  let top = 0;
  let left = 0;

  let element = node;
  while (element) {
    const { offsetTop, offsetLeft, clientLeft, clientTop } = element;
    top += offsetTop + clientTop;
    left += offsetLeft + clientLeft;
    element = element.offsetParent as HTMLElement;
  }
  return {
    top,
    left,
  };
};

export const getOffsets = (element: HTMLElement): Offsets => {
  const { top, left } = getPosition(element);
  const { offsetHeight, offsetWidth } = element;
  const height = offsetHeight;
  const width = offsetWidth;
  return {
    height,
    width,
    top,
    left,
    bottom: top + height,
    right: left + width,
  };
};
