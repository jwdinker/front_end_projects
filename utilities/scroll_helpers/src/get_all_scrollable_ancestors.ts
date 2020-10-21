import { ScrollableElement, ScrollAncestors } from './types';
import isOverflowable from './is_overflowable';

function getAllScrollableAncestors(
  element: ScrollableElement,
  ancestors: ScrollAncestors = []
): ScrollAncestors {
  if (element !== window) {
    const parent =
      'parentNode' in element && element.parentNode instanceof HTMLElement
        ? element.parentNode
        : null;

    if (parent) {
      if (isOverflowable(parent)) {
        ancestors.push(parent);
      }
      return getAllScrollableAncestors(parent, ancestors);
    }
  }
  ancestors.push(window);
  return ancestors;
}

export default getAllScrollableAncestors;
