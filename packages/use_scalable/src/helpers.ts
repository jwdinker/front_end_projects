import { Point, Distance, Dimensions } from './types';

export function hasChanged(previous: number[], current: number[]): boolean {
  return current.some((val, i) => previous[i] !== val);
}

export function makeCenterPoint(dimensions: Dimensions, coordinates: Point): Point {
  const y = coordinates[0] + dimensions[0] / 2;
  const x = coordinates[1] + dimensions[1] / 2;
  return [x, y];
}

export function getDistance(point: Point, center: Point): Distance {
  const [x1, y1] = point;
  const [x2, y2] = center;

  const x = Math.sqrt((Math.max(x1, x2) - Math.min(x1, x2)) ** 2);
  const y = Math.sqrt((Math.max(y1, y2) - Math.min(y1, y2)) ** 2);
  return [x, y, x + y];
}

export function getScale(vector: number, distance: number, lastDistance: number): number {
  return vector * (distance / lastDistance || 0);
}

export function constrain(min: number, max: number, value: number): number {
  return Math.min(max, Math.max(min, value));
}
