import { ScrollableElement } from './types';
import isOverflowable from './is_overflowable';

function getAllScrollableAncestors(
  element: ScrollableElement,
  ancestors: HTMLElement[] = []
): HTMLElement[] {
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

  return ancestors;
}

export default getAllScrollableAncestors;
