import makeHasChanged from '@jwdinker/make-has-changed';

export type Offsets = {
  top: number;
  left: number;
  bottom: number;
  right: number;
  height: number;
  width: number;
};

export interface Dimensions {
  height: number;
  width: number;
}

export const OFFSET_TYPES = {
  RELATIVE: 'relative',
  ABSOLUTE: 'absolute',
} as const;

export type OffsetType = typeof OFFSET_TYPES[keyof typeof OFFSET_TYPES];

const OFFSET_PROPS = ['top', 'left', 'height', 'width'];
const hasChanged = makeHasChanged(OFFSET_PROPS);

export const getPosition = (node: HTMLElement): { top: number; left: number } => {
  let top = 0;
  let left = 0;

  let element: Element | null = node;
  while (element) {
    if (element instanceof HTMLElement) {
      const { offsetTop, offsetLeft, clientLeft, clientTop } = element;
      top += offsetTop + clientTop;
      left += offsetLeft + clientLeft;
      element = element.offsetParent;
    } else {
      element = null;
    }
  }
  return {
    top,
    left,
  };
};

/**
 *
 * @param element  The HTML element object from which the offsets are taken.
 *
 * @description Traverses the DOM tree and recursively accumulates the offsets of the element and all the element's parent nodes.
 */
export const getAbsoluteOffsets = (element: HTMLElement): Offsets => {
  const { top, left } = getPosition(element);
  const { offsetHeight, offsetWidth } = element;
  const height = offsetHeight;
  const width = offsetWidth;
  return {
    height,
    width,
    top,
    left,
    bottom: top + height,
    right: left + width,
  };
};

/**
 *
 * @param element  The HTML element object from which the offsets are taken.
 *
 * @description Computes the distance of the outer border of the current element relative to the inner border of the  offsetParent node.
 */
export const getRelativeOffsets = (element: HTMLElement) => {
  const { offsetTop, offsetLeft, offsetHeight, offsetWidth } = element;
  const height = offsetHeight;
  const width = offsetWidth;
  return {
    height,
    width,
    top: offsetTop,
    left: offsetLeft,
    bottom: offsetTop + height,
    right: offsetLeft + width,
  };
};

/**
 *
 * @param element The HTML element object from which the offsets are taken
 *
 * @description Returns the offset height and offset width of an element.
 */
export const getOffsetDimensions = (element: HTMLElement): Dimensions => {
  return {
    height: element.offsetHeight,
    width: element.offsetWidth,
  };
};

/**
 *
 * @param element The HTML element object from which the offsets are taken.
 * @param offsetType "absolute" traverses the DOM tree and recursively
 * accumulates the offsets of the element and all the element's parent nodes.
 * "relative" computes the distance of the outer border of the current element
 * relative to the inner border of the offsetParent node.
 *
 * @description Computes the offsets of the supplied array of HTML elements at either a relative or absolute position.
 */
export const getElementOffsets = (
  element: HTMLElement,
  offsetType: OffsetType = OFFSET_TYPES.RELATIVE
): Offsets => {
  return offsetType === OFFSET_TYPES.ABSOLUTE
    ? getAbsoluteOffsets(element)
    : getRelativeOffsets(element);
};

/**
 *
 * @param elements An array of HTML elements from which the offsets are taken.
 * @param offsetType "absolute" traverses the DOM tree and recursively
 * accumulates the offsets of the element and all the element's parent nodes.
 * "relative" computes the distance of the outer border of the current element
 * relative to the inner border of the offsetParent node.
 *
 * @description Computes the offsets of the supplied array of HTML elements at
 * either a relative or absolute position.
 */
export const getOffsetsOfElements = (
  elements: HTMLElement[],
  offsetType: OffsetType = OFFSET_TYPES.RELATIVE
): Offsets[] => {
  const offsets: Offsets[] = [];
  for (let i = 0; i < elements.length; i += 1) {
    const element = elements[i];
    offsets.push(getElementOffsets(element, offsetType));
  }
  return offsets;
};

/**
 *
 * @param previous an array of offset measurements compared against the
 * properties of the current offset measurements.
 * @param current an array of offset measurements compared against the
 * previous offset measurements.
 * @description Compares offsets or array of offsets against each other to see if any of the properties' values have changed.
 */
export const haveOffsetsChanged = (
  previous: Offsets | Offsets[],
  current: Offsets | Offsets[]
): boolean => {
  if (Array.isArray(previous) && Array.isArray(current)) {
    if (previous.length !== current.length) {
      return true;
    }
    let changed = false;
    for (let index = 0; index < current.length; index += 1) {
      if (haveOffsetsChanged(previous[index], current[index])) {
        changed = true;
        break;
      }
    }
    return changed;
  }
  return hasChanged(previous, current);
};
