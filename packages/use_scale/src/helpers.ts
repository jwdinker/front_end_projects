import { Offsets } from '@jwdinker/use-offsets';
import get1TouchCoordinates from '@jwdinker/get-1-touch-coordinates';
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

export function getTouchScale(event: TouchEvent, requiredTouches: number, offsets: Offsets) {
  const { targetTouches } = event;
  const touchCount = targetTouches.length;

  if (requiredTouches === 1 && touchCount === 1) {
    return [get1TouchCoordinates(event), makeCenterPoint(offsets)];
  }

  if (requiredTouches === 2 && touchCount === 2) {
    return get2TouchCoordinates(event);
  }

  return NO_ROTATION;
}
