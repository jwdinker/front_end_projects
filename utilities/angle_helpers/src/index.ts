export type Point = number[];
export const TWO_PI = 2 * Math.PI;
export const RADIAN = 0.0174533;

export const radiansToDegrees = (radians: number): number => {
  const rotation = (radians * 180) / Math.PI;
  return rotation;
};

export function degreesToRadians(angle: number): number {
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

export function angleToDirections(point1: Point, point2: Point): number[] {
  const angle = getAngleFromPoints(point1, point2);
  let x = 0;
  let y = 0;

  if (angle <= 359 && angle >= 181) {
    x = -1;
  }

  if (angle <= 179 && angle >= 1) {
    x = 1;
  }

  if (angle >= 91 && angle <= 269) {
    y = 1;
  }

  if ((angle >= 271 && angle <= 369) || (angle >= 0 && angle <= 89)) {
    y = -1;
  }

  return [x, y];
}
