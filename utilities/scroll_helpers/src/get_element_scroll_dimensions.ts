import { ScrollDimensions } from './types';

function getElementScrollDimensions(
  element: HTMLElement,
  includeScrollBar = true
): ScrollDimensions {
  if (includeScrollBar) {
    return { height: element.scrollHeight, width: element.scrollWidth };
  }
  return { height: element.clientHeight, width: element.clientWidth };
}

export default getElementScrollDimensions;
