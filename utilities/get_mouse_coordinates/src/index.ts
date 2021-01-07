export type MouseCoordinates = number[];

function getMouseCoordinates(event: MouseEvent, coordinateType = 'page'): MouseCoordinates {
  const x = `${coordinateType}X`;
  const y = `${coordinateType}Y`;
  return [event[x], event[y]];
}

export default getMouseCoordinates;
