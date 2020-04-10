import { Point, Dimensions } from './types';

export function hasChanged(previous: number[], current: number[]): boolean {
  return current.some((val, i) => previous[i] !== val);
}

export function makeCenterPoint(dimensions: Dimensions, coordinates: Point): Point {
  const y = coordinates[0] + dimensions[0] / 2;
  const x = coordinates[1] + dimensions[1] / 2;
  return [x, y];
}

export function getScale(vector: number, distance: number, lastDistance: number): number {
  return vector * (distance / lastDistance || 0);
}

export function constrain(min: number, max: number, value: number): number {
  return Math.min(max, Math.max(min, value));
}
