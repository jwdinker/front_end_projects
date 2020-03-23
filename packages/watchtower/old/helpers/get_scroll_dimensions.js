function getScrollDimensions(target) {
  return target === window
    ? {
        height:
          (document.documentElement && document.documentElement.scrollHeight) ||
          document.body.scrollHeight,
        width:
          (document.documentElement && document.documentElement.scrollWidth) ||
          document.body.scrollWidth,
      }
    : {
        height: target.scrollHeight,
        width: target.scrollWidth,
      };
}

export default getScrollDimensions;
