import { Offsets } from '@jwdinker/use-offsets';
import get2TouchCoordinates from '@jwdinker/get-2-touch-coordinates';

const NO_ROTATION = [
  [0, 0],
  [0, 0],
];

export function makeCenterPoint(offsets: Offsets): number[] {
  const y = offsets.top + offsets.height / 2;
  const x = offsets.left + offsets.width / 2;
  return [x, y];
}

export function getTouchRotation(event: TouchEvent, requiredTouches: number, offsets: Offsets) {
  const { targetTouches } = event;
  const touchCount = targetTouches.length;

  if (requiredTouches === 1 && touchCount === 1) {
    const touch = targetTouches[0];
    return [[touch.pageX, touch.pageY], makeCenterPoint(offsets)];
  }

  if (requiredTouches === 2 && touchCount === 2) {
    return get2TouchCoordinates(event);
  }

  return NO_ROTATION;
}
