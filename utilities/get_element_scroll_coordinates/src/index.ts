export interface ScrollCoordinates {
  x: number;
  y: number;
}

const getElementScrollCoordinates = (target: HTMLElement): ScrollCoordinates => {
  return { x: target.scrollLeft || 0, y: target.scrollTop || 0 };
};

export default getElementScrollCoordinates;
