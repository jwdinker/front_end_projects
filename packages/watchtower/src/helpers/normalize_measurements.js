function normalizeMeasuremnts({ x, y, height, width, top, left, bottom, right }) {
  return {
    top,
    bottom,
    left,
    right,
    height,
    width,
  };
}
export default normalizeMeasuremnts;
