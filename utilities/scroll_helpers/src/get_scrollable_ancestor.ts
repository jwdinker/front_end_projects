import { ScrollableElement } from './types';
import isOverflowable from './is_overflowable';

function getScrollableAncestor(element: ScrollableElement): ScrollableElement {
  if (element !== window) {
    const parent =
      'parentNode' in element && element.parentNode instanceof HTMLElement
        ? element.parentNode
        : null;

    if (parent) {
      return isOverflowable(parent) ? parent : getScrollableAncestor(parent);
    }
  }
  return window;
}

export default getScrollableAncestor;
