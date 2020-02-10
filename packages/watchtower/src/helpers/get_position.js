function getPosition(node) {
  let top = 0;
  let left = 0;

  let element = node;
  while (element) {
    const { offsetTop, offsetLeft, offsetHeight, offsetWidth, clientLeft, clientTop } = element;
    top += offsetTop + clientTop;
    left += offsetLeft + clientLeft;
    element = element.offsetParent;
  }
  return {
    top,
    left,
  };
}

export default getPosition;
