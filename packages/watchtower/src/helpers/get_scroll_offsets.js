const getScrollOffsets = (target) => {
  return target === window
    ? {
        left: window.pageXOffset || document.documentElement.scrollLeft,
        top: window.pageYOffset || document.documentElement.scrollTop,
      }
    : {
        left: target.scrollLeft,
        top: target.scrollTop,
      };
};

export default getScrollOffsets;
