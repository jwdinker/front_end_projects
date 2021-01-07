export type TouchCoordinates = number[];

function getFarthestRightCoordinate(coordinates: TouchCoordinates[]): TouchCoordinates {
  if (coordinates.length === 2) {
    return coordinates[1];
  }
  const [farthestRight] = coordinates.sort((a, b) => {
    return a[0] > b[0] ? -1 : 0;
  });
  return farthestRight;
}

function getTouchCoordinates(
  touches: TouchList,
  index = 0,
  coordinateType = 'page'
): TouchCoordinates {
  const x = `${coordinateType}X`;
  const y = `${coordinateType}Y`;
  return [touches[index][x], touches[index][y]];
}

function makeTouchCoordinates(touches: TouchList, coordinateType = 'page'): TouchCoordinates[] {
  const coordinates: TouchCoordinates[] = [];
  for (let index = 0; index < touches.length; index += 1) {
    coordinates.push(getTouchCoordinates(touches, index, coordinateType));
  }
  return coordinates;
}

function get2TouchCoordinates(event: TouchEvent, coordinateType = 'page'): TouchCoordinates[] {
  const { touches } = event;
  const coordinates = makeTouchCoordinates(touches, coordinateType);
  return [coordinates[0], getFarthestRightCoordinate(coordinates)];
}

export default get2TouchCoordinates;
