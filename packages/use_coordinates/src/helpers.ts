import { Point, CoordinateDirections } from './types';

export const getDirection = (previous: Point, current: Point): CoordinateDirections => {
  const coordinates = [];
  for (let index = 0; index < 3; index += 1) {
    const p = previous[index];
    const c = current[index];
    const direction = c > p ? 1 : c < p ? -1 : 0;
    coordinates.push(direction);
  }
  return coordinates as CoordinateDirections;
};
