export type TouchCoordinates = number[];

export type CoordinateType = 'page' | 'client' | 'screen';

function get1TouchCoordinates(
  event: TouchEvent,
  coordinateType: CoordinateType = 'page'
): TouchCoordinates {
  const x = `${coordinateType}X`;
  const y = `${coordinateType}Y`;
  const touch = event.targetTouches[0];
  return [touch[x], touch[y]];
}

export default get1TouchCoordinates;
