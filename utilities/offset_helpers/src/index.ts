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

// recursively combines offsets of all the parents
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

export const getOffsetDimensions = (element: HTMLElement): Dimensions => {
  return {
    height: element.offsetHeight,
    width: element.offsetWidth,
  };
};

export const getElementOffsets = (
  element: HTMLElement,
  offsetType: OffsetType = OFFSET_TYPES.RELATIVE
): Offsets => {
  return offsetType === OFFSET_TYPES.ABSOLUTE
    ? getAbsoluteOffsets(element)
    : getRelativeOffsets(element);
};

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
