export interface AbbreviatedRectangle {
  top: number;
  left: number;
  height: number;
  width: number;
}

export interface Padding {
  top: number;
  bottom: number;
  left: number;
  right: number;
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

export const DEFAULT_PADDING: Padding = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

function preventOverflow(props: PreventOverflowProps) {
  const { element, boundaries, padding = DEFAULT_PADDING, allow = [] } = props;

  const allowed = SIDES.reduce((accumulator, side) => {
    accumulator[side] = allow.indexOf(side) > -1;
    return accumulator;
  }, {} as AllowedSides);

  const values = element;
  const prevented: PreventedSides = [];

  const bottomBoundary = boundaries.top + boundaries.height;
  const rightBoundary = boundaries.left + boundaries.width;

  if (!allowed.top && element.top <= boundaries.top + padding.top) {
    values.top = boundaries.top + padding.top;
    prevented.push('top');
  }

  if (!allowed.bottom && element.top >= bottomBoundary - element.height + padding.bottom) {
    values.top = bottomBoundary - element.height + padding.bottom;
    prevented.push('bottom');
  }

  if (!allowed.left && element.left <= boundaries.left + padding.left) {
    values.left = boundaries.left + padding.left;
    prevented.push('left');
  }

  if (!allowed.right && element.left >= rightBoundary - element.width + padding.right) {
    values.left = rightBoundary - element.width + padding.right;
    prevented.push('right');
  }

  return [values, prevented];
}

export default preventOverflow;
