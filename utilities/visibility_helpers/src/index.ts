export interface AbbreviatedRectangle {
  top: number;
  left: number;
  height: number;
  width: number;
}

export type Side = 'top' | 'bottom' | 'left' | 'right';

type SideConditionFn = (element: AbbreviatedRectangle, container: AbbreviatedRectangle) => boolean;
type SideCondition = [Side, SideConditionFn];

const makeConditionAccumulator = (sidesAndFns: SideCondition[]) => {
  return (element: AbbreviatedRectangle, container: AbbreviatedRectangle): Side[] => {
    const conditionMet = [];
    for (let i = 0; i < sidesAndFns.length; i += 1) {
      const [side, fn] = sidesAndFns[i];
      if (fn(element, container)) {
        conditionMet.push(side);
      }
    }
    return conditionMet as Side[];
  };
};

/*
---------------------------------------
    BOUNDARIES
---------------------------------------
*/
export const inBoundsX = (
  element: AbbreviatedRectangle,
  container: AbbreviatedRectangle
): boolean => {
  const elementRight = element.left + element.width;
  const containerRight = container.left + container.width;
  return element.left >= container.left && elementRight <= containerRight;
};

export const inBoundsY = (
  element: AbbreviatedRectangle,
  container: AbbreviatedRectangle
): boolean => {
  const elementBottom = element.top + element.height;
  const containerBottom = container.top + container.height;
  return element.top >= container.top && elementBottom <= containerBottom;
};

/**
 * Returns true if the entirety of the element is visible within the containing element.
 */
export const inBoundaries = (
  element: AbbreviatedRectangle,
  container: AbbreviatedRectangle
): boolean => {
  return inBoundsX(element, container) && inBoundsY(element, container);
};

/*
---------------------------------------
    OVERFLOWING EDGES
---------------------------------------
*/

/**
 * Returns true if the element is visible or partially visible on the Y axis.
 */
const isVisibleY = (element: AbbreviatedRectangle, container: AbbreviatedRectangle) => {
  return (
    element.top + element.height >= container.top && element.top < container.top + container.height
  );
};

/**
 * Returns true if the element is visible or partially visible on the X axis.
 */
const isVisibleX = (element: AbbreviatedRectangle, container: AbbreviatedRectangle) =>
  element.left + element.width >= container.left && element.left < container.left + container.width;

/**
 * Returns true if the element visible or partially visible.
 */
export const isVisible = (element: AbbreviatedRectangle, container: AbbreviatedRectangle) =>
  isVisibleX(element, container) && isVisibleY(element, container);

/**
 * Returns true if the element is partly visible and a top portion of the element is overflowing.
 */
export const isTopOverflowing = (element: AbbreviatedRectangle, container: AbbreviatedRectangle) =>
  isVisible(element, container) &&
  element.top <= container.top &&
  element.top + element.height >= container.top;

/**
 * Returns true if the element is partly visible and a bottom portion of the element is overflowing.
 */
export const isBottomOverflowing = (
  element: AbbreviatedRectangle,
  container: AbbreviatedRectangle
) =>
  isVisible(element, container) &&
  element.top <= container.top + container.height &&
  element.top + element.height >= container.top + container.height;

/**
 * Returns true if the element is partly visible and a left portion of the element is overflowing.
 */
export const isLeftOverflowing = (element: AbbreviatedRectangle, container: AbbreviatedRectangle) =>
  isVisible(element, container) &&
  element.left <= container.left &&
  element.left + element.width >= container.left;

/**
 * Returns true if the element is partly visible and a right portion of the
 * element is overflowing.
 */
export const isRightOverflowing = (
  element: AbbreviatedRectangle,
  container: AbbreviatedRectangle
) =>
  isVisible(element, container) &&
  element.left <= container.left + container.width &&
  element.left + element.width >= container.left + container.width;

const OVERFLOWING_EDGE_FNS = [
  ['top', isTopOverflowing],
  ['bottom', isBottomOverflowing],
  ['left', isLeftOverflowing],
  ['right', isRightOverflowing],
] as SideCondition[];

/**
 * Returns the sides of the element where a portion of the element is overflowing the containing element.
 */
export const getEdgesOverflowing = makeConditionAccumulator(OVERFLOWING_EDGE_FNS);

/*
---------------------------------------
    COMPLETE OVERFLOW
---------------------------------------
*/

/**
 * Returns true if the element has overflowed the X axis and is not visible.
 */
export const isOverflowedX = (
  element: AbbreviatedRectangle,
  container: AbbreviatedRectangle
): boolean => {
  const elementRight = element.left + element.width;
  const containerRight = container.left + container.width;
  return element.left < container.left || elementRight > containerRight;
};

/**
 * Returns true if the element has overflowed the Y axis and is not visible.
 */
export const isOverflowedY = (
  element: AbbreviatedRectangle,
  container: AbbreviatedRectangle
): boolean => {
  const elementBottom = element.top + element.height;
  const containerBottom = container.top + container.height;
  return element.top < container.top || elementBottom > containerBottom;
};

/**
 * Returns true if the element is currently overflowed on the X or Y axis and is not visible.
 */
export const isOverflowed = (
  element: AbbreviatedRectangle,
  container: AbbreviatedRectangle
): boolean => {
  return isOverflowedX(element, container) || isOverflowedY(element, container);
};

/**
 * Returns true if the element is currently overflowed and above the containing element.
 */
export const isTopOverflowed = (element: AbbreviatedRectangle, container: AbbreviatedRectangle) =>
  isOverflowed(element, container) && element.top + element.height < container.top;

/**
 * Returns true if the element is currently overflowed and below the containing element.
 */
export const isBottomOverflowed = (
  element: AbbreviatedRectangle,
  container: AbbreviatedRectangle
) => isOverflowed(element, container) && element.top > container.top + container.height;

/**
 * Returns true if the element is currently overflowed and left of the containing element.
 */
export const isLeftOveflowed = (element: AbbreviatedRectangle, container: AbbreviatedRectangle) =>
  isOverflowed(element, container) && element.left + element.width < container.left;

/**
 * Returns true if the element is currently overflowed and right of the containing element.
 */
export const isRightOverflowed = (element: AbbreviatedRectangle, container: AbbreviatedRectangle) =>
  isOverflowed(element, container) && element.left > container.left + container.width;

const OVERFLOW_FNS = [
  ['top', isTopOverflowed],
  ['bottom', isBottomOverflowed],
  ['left', isLeftOveflowed],
  ['right', isRightOverflowed],
] as SideCondition[];

/**
 * Returns the sides at which the element is currently overflowed.
 */
export const getOverflowedSides = makeConditionAccumulator(OVERFLOW_FNS);

/*
---------------------------------------
    AT SIDE 
---------------------------------------
*/

/**
 * Returns true if the element is partly visible and flush with the top of the containing element.
 */
export const atTop = (element: AbbreviatedRectangle, container: AbbreviatedRectangle) =>
  isVisible(element, container) && element.top === container.top;

/**
 * Returns true if the element is partly visible and flush with the bottom of the containing element.
 */
export const atBottom = (element: AbbreviatedRectangle, container: AbbreviatedRectangle) =>
  isVisible(element, container) &&
  element.top + element.height === container.top + container.height;

/**
 * Returns true if the element is partly visible and flush with the left of the containing element.
 */
export const atLeft = (element: AbbreviatedRectangle, container: AbbreviatedRectangle) =>
  isVisible(element, container) && element.left === container.left;

/**
 * Returns true if the element is partly visible and flush with the right of the containing element.
 */
export const atRight = (element: AbbreviatedRectangle, container: AbbreviatedRectangle) =>
  isVisible(element, container) &&
  element.left + element.width === container.left + container.width;

const AT_EDGE_FNS = [
  ['top', atTop],
  ['bottom', atBottom],
  ['left', atLeft],
  ['right', atRight],
] as SideCondition[];

/**
 * Returns the sides of the element that are flush with that of the containing element.
 */
export const getAtSides = makeConditionAccumulator(AT_EDGE_FNS);

/*
---------------------------------------
    VISIBILITY AMOUNTS
---------------------------------------
*/
export const getVisibleX = (
  element: AbbreviatedRectangle,
  container: AbbreviatedRectangle
): number => {
  const distanceX =
    Math.min(container.left, element.left) -
    Math.max(container.left + container.width, element.left + element.width);

  const visibleX = Math.max(distanceX + container.width + element.width, 0);
  return visibleX;
};

export const getVisibleY = (
  element: AbbreviatedRectangle,
  container: AbbreviatedRectangle
): number => {
  const distanceY =
    Math.min(container.top, element.top) -
    Math.max(container.top + container.height, element.top + element.height);

  const visibleY = Math.max(distanceY + container.height + element.height, 0);

  return visibleY;
};

export const getVisiblePixels = (
  element: AbbreviatedRectangle,
  container: AbbreviatedRectangle
) => {
  if (!isVisible(element, container)) {
    return [0, 0];
  }
  return [getVisibleX(element, container), getVisibleY(element, container)];
};

export const getVisiblePercentage = (
  element: AbbreviatedRectangle,
  container: AbbreviatedRectangle
) => {
  if (!isVisible(element, container)) {
    return 0;
  }
  const [visibleX, visibleY] = getVisiblePixels(element, container);

  const visibleArea = visibleX * visibleY;
  const elementArea = element.width * element.height;

  const visibleAreaPercentage =
    elementArea === 0 ? 0 : Math.round((visibleArea / elementArea) * 100);
  return visibleAreaPercentage;
};
