export type MouseCoordinates = number[];

export type CoordinateType = 'page' | 'client' | 'screen';

function getMouseCoordinates(
  event: MouseEvent,
  coordinateType: CoordinateType = 'page'
): MouseCoordinates {
  const x = `${coordinateType}X`;
  const y = `${coordinateType}Y`;
  return [event[x], event[y]];
}

export default getMouseCoordinates;
