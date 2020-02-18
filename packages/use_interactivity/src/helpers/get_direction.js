import { DIRECTION_BY_AXIS } from '../constants';

function getDirection(previousPoints, currentPoints) {
  return currentPoints.map((value, index) => {
    const [OUTER, INNER, NONE] = DIRECTION_BY_AXIS[index];
    const currentValue = Math.abs(value);
    const previousValue = Math.abs(previousPoints[index]);
    return previousValue > currentValue ? OUTER : previousValue < currentValue ? INNER : NONE;
  });
}

export default getDirection;
