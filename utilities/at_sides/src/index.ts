export interface PositionAndSize {
  top: number;
  left: number;
  height: number;
  width: number;
}

export type Side = 'top' | 'bottom' | 'left' | 'right';

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
    AT SIDE 
---------------------------------------
*/

/**
 * Returns true if the element is partly visible and flush with the top of the containing element.
 */
export const atTop = (element: PositionAndSize, container: PositionAndSize) =>
  isVisible(element, container) && element.top === container.top;

/**
 * Returns true if the element is partly visible and flush with the bottom of the containing element.
 */
export const atBottom = (element: PositionAndSize, container: PositionAndSize) =>
  isVisible(element, container) &&
  element.top + element.height === container.top + container.height;

/**
 * Returns true if the element is partly visible and flush with the left of the containing element.
 */
export const atLeft = (element: PositionAndSize, container: PositionAndSize) =>
  isVisible(element, container) && element.left === container.left;

/**
 * Returns true if the element is partly visible and flush with the right of the containing element.
 */
export const atRight = (element: PositionAndSize, container: PositionAndSize) =>
  isVisible(element, container) &&
  element.left + element.width === container.left + container.width;

const AT_EDGE_FNS = [
  ['top', atTop],
  ['bottom', atBottom],
  ['left', atLeft],
  ['right', atRight],
] as const;

/**
 * Returns the sides of the element that are flush with that of the containing element.
 */

/**
 * Returns the sides at which the element is currently overflowed.
 */
export const getAtSides = (element: PositionAndSize, container: PositionAndSize) => {
  const sides: Side[] = [];
  for (let i = 0; i < AT_EDGE_FNS.length; i += 1) {
    const [side, fn] = AT_EDGE_FNS[i];
    if (fn(element, container)) {
      sides.push(side);
    }
  }

  return sides;
};
