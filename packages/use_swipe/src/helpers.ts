export const getVelocity = (distance: number, elapsed: number): number => {
  const number = distance / elapsed;
  return Math.round((number + Number.EPSILON) * 100) / 100;
};

export const getTouchCoordinates = (event: TouchEvent): number[] => {
  const { pageX, pageY } = event.targetTouches[0];
  return [pageX, pageY];
};
