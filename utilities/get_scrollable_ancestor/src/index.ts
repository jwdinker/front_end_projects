export const OVERFLOW_VALUES = ['overflow-x', 'overflow-y', 'overflow'];

export type ScrollableAncestor = Window | Element;

export type ScrollableAncestors = Array<Window | Element>;

export function hasOverflowableProperty(element: ScrollableAncestor): boolean {
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

const getScrollableAncestor = (reference: ScrollableAncestor): ScrollableAncestor => {
  if (reference !== window) {
    const parent = (reference as HTMLElement).parentNode as HTMLElement;

    const isBody = parent === document.body;
    if (!isBody) {
      return hasOverflowableProperty(parent) ? parent : getScrollableAncestor(parent);
    }
  }
  return window;
};

export const getAllScrollableAncestors = (
  element: ScrollableAncestor,
  ancestors: ScrollableAncestors = []
): ScrollableAncestors => {
  if (element !== window) {
    const parent =
      'parentNode' in element && element.parentNode instanceof HTMLElement
        ? element.parentNode
        : null;

    if (parent) {
      if (hasOverflowableProperty(parent)) {
        ancestors.push(parent);
      }
      return getAllScrollableAncestors(parent, ancestors);
    }
  }
  ancestors.push(window);
  return ancestors;
};

export default getScrollableAncestor;
