import { PRIMARY_SIDES } from '../constants';

function getDirection(_previous, _current) {
  const directions = [];

  for (let i = 0; i < PRIMARY_SIDES.length; i++) {
    const side = PRIMARY_SIDES[i];
    const previous = _previous[side];
    const current = _current[side];
    const direction = previous < current ? 1 : previous > current ? -1 : 0;
    directions.push(direction);
  }
  return directions;
}
export default getDirection;
