import { MouseCoordinates } from './types';

export { MouseCoordinates } from './types';

export function getMouseCoordinates(event: MouseEvent, coordinateType = 'page'): MouseCoordinates {
  const x = `${coordinateType}X`;
  const y = `${coordinateType}Y`;
  return [event[x], event[y]];
}
