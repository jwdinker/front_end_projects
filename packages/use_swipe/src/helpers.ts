export const getVelocity = (distance: number, elapsed: number): number => {
  const number = distance / elapsed;
  return Math.round((number + Number.EPSILON) * 100) / 100;
};
