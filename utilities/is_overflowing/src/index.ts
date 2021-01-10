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

/**
 * Returns true if the element is partly visible and a top portion of the element is overflowing.
 */
export const isTopOverflowing = (element: PositionAndSize, container: PositionAndSize) =>
  isVisible(element, container) &&
  element.top <= container.top &&
  element.top + element.height >= container.top;

/**
 * Returns true if the element is partly visible and a bottom portion of the element is overflowing.
 */
export const isBottomOverflowing = (element: PositionAndSize, container: PositionAndSize) =>
  isVisible(element, container) &&
  element.top <= container.top + container.height &&
  element.top + element.height >= container.top + container.height;

/**
 * Returns true if the element is partly visible and a left portion of the element is overflowing.
 */
export const isLeftOverflowing = (element: PositionAndSize, container: PositionAndSize) =>
  isVisible(element, container) &&
  element.left <= container.left &&
  element.left + element.width >= container.left;

/**
 * Returns true if the element is partly visible and a right portion of the
 * element is overflowing.
 */
export const isRightOverflowing = (element: PositionAndSize, container: PositionAndSize) =>
  isVisible(element, container) &&
  element.left <= container.left + container.width &&
  element.left + element.width >= container.left + container.width;

const OVERFLOWING_EDGE_FNS = [
  ['top', isTopOverflowing],
  ['bottom', isBottomOverflowing],
  ['left', isLeftOverflowing],
  ['right', isRightOverflowing],
] as const;

const OVERFLOWING_BY_SIDE_FNS = [
  isTopOverflowing,
  isBottomOverflowing,
  isLeftOverflowing,
  isRightOverflowing,
];

export const getOverflowingSides = (element: PositionAndSize, container: PositionAndSize) => {
  const overflowingSides: Side[] = [];
  for (let i = 0; i < OVERFLOWING_EDGE_FNS.length; i += 1) {
    const [side, fn] = OVERFLOWING_EDGE_FNS[i];
    if (fn(element, container)) {
      overflowingSides.push(side);
    }
  }
  return overflowingSides;
};

export const isOverflowing = (element: PositionAndSize, container: PositionAndSize) => {
  return OVERFLOWING_BY_SIDE_FNS.some((fn) => fn(element, container));
};
