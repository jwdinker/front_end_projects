import { TWO_PI } from '@jwdinker/angle-helpers';
import { RotationDirection, UseRotatableState } from './types';

export function isClockwise(direction: RotationDirection): boolean {
  return direction === 1;
}

export function isCounterClockwise(direction: RotationDirection): boolean {
  return direction === -1;
}

export function getRotatableState(
  previousState: UseRotatableState,
  radians: number
): UseRotatableState {
  const { totalRadians, radians: previousRadians } = previousState;

  // This makes it so that (currentAngle + offset) is always within ±180 degrees of previous
  const offset = Math.round((previousRadians - radians) / TWO_PI) * TWO_PI;
  const delta = radians + offset - previousRadians;
  const nextRotationTotal = totalRadians + delta;
  return {
    ...previousState,
    isRotating: true,
    radians,
    totalRadians: nextRotationTotal,
    direction: nextRotationTotal === totalRadians ? 0 : nextRotationTotal > totalRadians ? 1 : -1,
  };
}
