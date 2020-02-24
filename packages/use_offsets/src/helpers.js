// recursively combines offsets of all the parents
export const getPosition = (node) => {
  let top = 0;
  let left = 0;

  let element = node;
  while (element) {
    const { offsetTop, offsetLeft, clientLeft, clientTop } = element;
    top += offsetTop + clientTop;
    left += offsetLeft + clientLeft;
    element = element.offsetParent;
  }
  return {
    top,
    left,
  };
};

export const getOffsets = (element) => {
  const { top, left } = getPosition(element);
  const { offsetHeight, offsetWidth } = element;
  const height = offsetHeight;
  const width = offsetWidth;
  return {
    height,
    width,
    top,
    left,
    bottom: top + height,
    right: left + width,
  };
};
