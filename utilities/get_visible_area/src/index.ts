export interface PositionAndSize {
  top: number;
  left: number;
  height: number;
  width: number;
}

/**
 * Returns true if the element is visible or partially visible.
 */
const isVisible = (element: PositionAndSize, container: PositionAndSize) => {
  const isVisibleX =
    element.left + element.width >= container.left &&
    element.left < container.left + container.width;
  const isVisibleY =
    element.top + element.height >= container.top && element.top < container.top + container.height;
  return isVisibleX && isVisibleY;
};

/*
---------------------------------------
    VISIBILITY AMOUNTS
---------------------------------------
*/
export const getVisibleX = (element: PositionAndSize, container: PositionAndSize): number => {
  const distanceX =
    Math.min(container.left, element.left) -
    Math.max(container.left + container.width, element.left + element.width);

  const visibleX = Math.max(distanceX + container.width + element.width, 0);
  return visibleX;
};

export const getVisibleY = (element: PositionAndSize, container: PositionAndSize): number => {
  const distanceY =
    Math.min(container.top, element.top) -
    Math.max(container.top + container.height, element.top + element.height);

  const visibleY = Math.max(distanceY + container.height + element.height, 0);

  return visibleY;
};

export const getVisiblePixels = (element: PositionAndSize, container: PositionAndSize) => {
  if (!isVisible(element, container)) {
    return [0, 0];
  }
  return [getVisibleX(element, container), getVisibleY(element, container)];
};

export const getVisibleArea = (
  element: PositionAndSize,
  container: PositionAndSize,
  unit: 'px' | '%' = '%'
) => {
  if (!isVisible(element, container)) {
    return 0;
  }
  const [visibleX, visibleY] = getVisiblePixels(element, container);

  const visibleArea = visibleX * visibleY;
  const elementArea = element.width * element.height;

  if (elementArea === 0) {
    return 0;
  }

  if (unit === '%') {
    return Math.round((visibleArea / elementArea) * 100);
  }

  return visibleArea / elementArea;
};
