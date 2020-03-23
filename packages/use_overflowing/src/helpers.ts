import { AbbreviatedRectangle, Overflowing, Boundaries, Rectangle } from './types';
import { SIDES, SIDE_OPPOSITES } from './constants';

export function toRectangle(element: AbbreviatedRectangle): Rectangle {
  const { top, left, height, width } = element;
  return {
    top,
    left,
    right: left + width,
    bottom: top + height,
  };
}

export function isAbbreviated<T>(element: T): boolean {
  return !('bottom' in element) || !('right' in element);
}

export const getOverflowingSides = (element: Rectangle, boundaries: Boundaries): Overflowing => {
  const intersecting: Overflowing = {};
  for (let index = 0; index <= SIDES.length - 1; index += 1) {
    const side = SIDES[index];
    const opposite = SIDE_OPPOSITES[side];

    const isIntersecting =
      index % 2 === 0
        ? element[side] <= boundaries[side] || element[opposite] <= boundaries[side]
        : element[side] >= boundaries[side] || element[opposite] >= boundaries[side];

    if (isIntersecting) {
      intersecting[side] = true;
    } else {
      intersecting[side] = false;
    }
  }
  return intersecting;
};

const makeHasChanged = (props: string[]) => <P, C>(previous: P, current: C) =>
  props.some((prop) => previous[prop] !== current[prop]);

export const hasSidesChanged = makeHasChanged(SIDES);
