export interface PositionAndSize {
  top: number;
  left: number;
  height: number;
  width: number;
}

/**
 * Returns true if the element is visible or partially visible on the Y axis.
 */
const isVisibleY = (element: PositionAndSize, container: PositionAndSize) => {
  return (
    element.top + element.height >= container.top && element.top < container.top + container.height
  );
};

/**
 * Returns true if the element is visible or partially visible on the X axis.
 */
const isVisibleX = (element: PositionAndSize, container: PositionAndSize) =>
  element.left + element.width >= container.left && element.left < container.left + container.width;

/**
 * Returns true if the element visible or partially visible.
 */
export const isVisible = (element: PositionAndSize, container: PositionAndSize) =>
  isVisibleX(element, container) && isVisibleY(element, container);
