function getScrollableAncestor(ref) {
  if (ref !== 'window') {
    const parent = ref.parentNode;
    const isBody = parent === document.body;

    if (parent && !isBody) {
      const style = window.getComputedStyle(parent);

      const isOverflowing = ['overflow-x', 'overflow-y', 'overflow'].some((property) => {
        const value = style.getPropertyValue(property);
        const isHidden = value === 'hidden';
        const isAuto = value === 'auto';
        const isScroll = value === 'scroll';
        if (isHidden) {
          return false;
        }
        return isAuto || isScroll;
      });

      if (isOverflowing) {
        return parent;
      }
      return getScrollableAncestor(parent);
    }
  }

  return window;
}

export default getScrollableAncestor;
