export type Point = number[];
export const TWO_PI = 2 * Math.PI;
export const RADIAN = 0.0174533;

export const radiansToDegrees = (radians: number): number => {
  const rotation = (radians * 180) / Math.PI;
  return rotation;
};

export function angleToRadians(angle: number): number {
  return angle * RADIAN;
}

export function getRadians(point1: Point, point2: Point): number {
  const [x1, y1] = point1;
  const [x2, y2] = point2;

  const angle = Math.atan2(x2 - x1, y2 * -1 - y1 * -1);
  if (angle < 0) {
    return angle + TWO_PI;
  }
  return angle;
}

export function getAngleFromPoints(point1: Point, point2: Point): number {
  return radiansToDegrees(getRadians(point1, point2));
}
