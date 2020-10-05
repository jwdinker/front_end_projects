export const OVERFLOW_VALUES = ['overflow-x', 'overflow-y', 'overflow'];

function isOverflowable(element: HTMLElement | Document['body']): boolean {
  if (element instanceof HTMLElement || element === document.body) {
    const style = window.getComputedStyle(element);

    return OVERFLOW_VALUES.some((property) => {
      const value = style.getPropertyValue(property);

      const isAuto = value === 'auto';
      const isScroll = value === 'scroll';

      return isAuto || isScroll;
    });
  }
  return false;
}

export default isOverflowable;
