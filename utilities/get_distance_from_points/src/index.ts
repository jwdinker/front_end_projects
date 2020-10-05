export type Point = number[];
export type Distance = [number, number, number];

function getDistanceFromPoints(point: Point, center: Point): Distance {
  const [x1, y1] = point;
  const [x2, y2] = center;

  const x = Math.sqrt((Math.max(x1, x2) - Math.min(x1, x2)) ** 2);
  const y = Math.sqrt((Math.max(y1, y2) - Math.min(y1, y2)) ** 2);
  return [x, y, x + y];
}

export default getDistanceFromPoints;
