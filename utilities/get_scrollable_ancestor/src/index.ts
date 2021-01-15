import isOverflowable from '@jwdinker/is-overflowable';

export type ScrollableAncestor = Window | Element;

export type ScrollableAncestors = Array<Window | Element>;

const getScrollableAncestor = (reference: ScrollableAncestor): ScrollableAncestor => {
  if (reference !== window) {
    const parent =
      'parentNode' in reference && reference.parentNode instanceof Element
        ? reference.parentNode
        : null;
    if (parent && parent !== document.body) {
      return isOverflowable(parent) ? parent : getScrollableAncestor(parent);
    }
  }
  return window;
};

const _getAllScrollableAncestors = (
  element: ScrollableAncestor,
  ancestors: ScrollableAncestors = []
): ScrollableAncestors => {
  if (element !== window) {
    const parent =
      'parentNode' in element && element.parentNode instanceof Element ? element.parentNode : null;

    if (parent) {
      if (isOverflowable(parent)) {
        ancestors.push(parent);
      }
      return _getAllScrollableAncestors(parent, ancestors);
    }
  }
  ancestors.push(window);
  return ancestors;
};

export const getAllScrollableAncestors = (element: ScrollableAncestor) => {
  return _getAllScrollableAncestors(element, []);
};

export default getScrollableAncestor;
