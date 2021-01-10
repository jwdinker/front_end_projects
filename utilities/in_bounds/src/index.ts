export interface PositionAndSize {
  top: number;
  left: number;
  height: number;
  width: number;
}

export const inBoundsX = (element: PositionAndSize, container: PositionAndSize): boolean => {
  const elementRight = element.left + element.width;
  const containerRight = container.left + container.width;
  return element.left >= container.left && elementRight <= containerRight;
};

export const inBoundsY = (element: PositionAndSize, container: PositionAndSize): boolean => {
  const elementBottom = element.top + element.height;
  const containerBottom = container.top + container.height;
  return element.top >= container.top && elementBottom <= containerBottom;
};

/**
 * Returns true if the entirety of the element is visible within the containing element.
 */
export const inBounds = (element: PositionAndSize, container: PositionAndSize): boolean => {
  return inBoundsX(element, container) && inBoundsY(element, container);
};
