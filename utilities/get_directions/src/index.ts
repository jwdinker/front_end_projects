export type Direction = 1 | 0 | -1;

const getDirections = <P, C>(previous: P, current: C): Direction[] => {
  const directions = [];
  if (Array.isArray(current)) {
    for (let index = 0; index < current.length; index += 1) {
      const p = previous[index];
      const c = current[index];
      const direction = c > p ? 1 : c < p ? -1 : 0;
      directions.push(direction);
    }

    return directions as Direction[];
  }
  return [];
};

export default getDirections;
