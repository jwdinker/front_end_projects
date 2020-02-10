function getDimensions(element) {
  return {
    height: element.offsetHeight,
    width: element.offsetWidth,
  };
}

export default getDimensions;
