import { ScrollCoordinates } from './types';

const getElementScrollCoordinates = (target: HTMLElement): ScrollCoordinates => {
  return { x: target.scrollLeft, y: target.scrollTop };
};

export default getElementScrollCoordinates;
