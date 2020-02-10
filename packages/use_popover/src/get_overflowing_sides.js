import { OPPOSITES } from './constants';

const SIDES = ['top', 'bottom', 'left', 'right'];
function getOverflowingSides(element, container) {
  const intersecting = {};
  for (let index = 0; index <= SIDES.length - 1; index += 1) {
    const side = SIDES[index];
    const opposite = OPPOSITES[side];

    const isIntersecting =
      index % 2 === 0
        ? element[side] <= container[side] || element[opposite] <= container[side]
        : element[side] >= container[side] || element[opposite] >= container[side];

    if (isIntersecting) {
      intersecting[side] = true;
    } else {
      intersecting[side] = false;
    }
  }
  return intersecting;
}

export default getOverflowingSides;
