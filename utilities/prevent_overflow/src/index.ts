export interface AbbreviatedRectangle {
  top: number;
  left: number;
  height: number;
  width: number;
}

export interface Padding {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export type Side = 'top' | 'bottom' | 'left' | 'right';

export interface PreventOverflowProps {
  element: AbbreviatedRectangle;
  boundaries: AbbreviatedRectangle;
  padding?: Padding;
  allow?: Side[];
}

interface AllowedSides {
  top: boolean;
  left: boolean;
  right: boolean;
  bottom: boolean;
}

export type PreventOverflowValues = AbbreviatedRectangle;
export type PreventedSides = Side[];

export type PreventOverflowReturn = [PreventOverflowValues, PreventedSides];

const SIDES = ['top', 'bottom', 'left', 'right'] as const;

function preventOverflow(props: PreventOverflowProps): PreventOverflowReturn {
  const { element, boundaries, padding = {}, allow = [] } = props;
  const { top = 0, left = 0, right = 0, bottom = 0 } = padding;

  const allowed = SIDES.reduce((accumulator, side) => {
    accumulator[side] = allow.indexOf(side) > -1;
    return accumulator;
  }, {} as AllowedSides);

  const values = element;
  const prevented: PreventedSides = [];

  const bottomBoundary = boundaries.top + boundaries.height;
  const rightBoundary = boundaries.left + boundaries.width;

  if (!allowed.top && element.top <= boundaries.top + top) {
    values.top = boundaries.top + top;
    prevented.push('top');
  }

  if (!allowed.bottom && element.top >= bottomBoundary - element.height + bottom) {
    values.top = bottomBoundary - element.height + bottom;
    prevented.push('bottom');
  }

  if (!allowed.left && element.left <= boundaries.left + left) {
    values.left = boundaries.left + left;
    prevented.push('left');
  }

  if (!allowed.right && element.left >= rightBoundary - element.width + right) {
    values.left = rightBoundary - element.width + right;
    prevented.push('right');
  }

  return [values, prevented];
}

export default preventOverflow;
