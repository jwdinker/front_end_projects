export interface PositionAndSize {
  top: number;
  left: number;
  height: number;
  width: number;
}

export type Side = 'top' | 'bottom' | 'left' | 'right';

/*
---------------------------------------
    COMPLETE OVERFLOW
---------------------------------------
*/

/**
 * Returns true if the element has overflowed the X axis and is not visible.
 */
export const isOverflowedX = (element: PositionAndSize, container: PositionAndSize): boolean => {
  const elementRight = element.left + element.width;
  const containerRight = container.left + container.width;
  return element.left < container.left || elementRight > containerRight;
};

/**
 * Returns true if the element has overflowed the Y axis and is not visible.
 */
export const isOverflowedY = (element: PositionAndSize, container: PositionAndSize): boolean => {
  const elementBottom = element.top + element.height;
  const containerBottom = container.top + container.height;
  return element.top < container.top || elementBottom > containerBottom;
};

/**
 * Returns true if the element is currently overflowed on the X or Y axis and is not visible.
 */
export const isOverflowed = (element: PositionAndSize, container: PositionAndSize): boolean => {
  return isOverflowedX(element, container) || isOverflowedY(element, container);
};

/**
 * Returns true if the element is currently overflowed and above the containing element.
 */
export const isTopOverflowed = (element: PositionAndSize, container: PositionAndSize) =>
  isOverflowed(element, container) && element.top + element.height < container.top;

/**
 * Returns true if the element is currently overflowed and below the containing element.
 */
export const isBottomOverflowed = (element: PositionAndSize, container: PositionAndSize) =>
  isOverflowed(element, container) && element.top > container.top + container.height;

/**
 * Returns true if the element is currently overflowed and left of the containing element.
 */
export const isLeftOveflowed = (element: PositionAndSize, container: PositionAndSize) =>
  isOverflowed(element, container) && element.left + element.width < container.left;

/**
 * Returns true if the element is currently overflowed and right of the containing element.
 */
export const isRightOverflowed = (element: PositionAndSize, container: PositionAndSize) =>
  isOverflowed(element, container) && element.left > container.left + container.width;

const OVERFLOWED_FNS = [
  ['top', isTopOverflowed],
  ['bottom', isBottomOverflowed],
  ['left', isLeftOveflowed],
  ['right', isRightOverflowed],
] as const;

/**
 * Returns the sides at which the element is currently overflowed.
 */
export const getOverflowedSides = (element: PositionAndSize, container: PositionAndSize) => {
  const sides: Side[] = [];
  for (let i = 0; i < OVERFLOWED_FNS.length; i += 1) {
    const [side, fn] = OVERFLOWED_FNS[i];
    if (fn(element, container)) {
      sides.push(side);
    }
  }

  return sides;
};
