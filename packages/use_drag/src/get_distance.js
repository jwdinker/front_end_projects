function getDistance(point1, point2) {
  const [x1, y1] = point1;
  const [x2, y2] = point2;
  const xDifference = (x2 - x1, 2) ** 2;
  const yDifference = (y2 - y1, 2) ** 2;
  return Math.sqrt(xDifference + yDifference);
}

export default getDistance;
