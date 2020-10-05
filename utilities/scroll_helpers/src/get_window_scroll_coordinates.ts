import { ScrollCoordinates } from './types';

const getWindowScrollCoordinates = (): ScrollCoordinates => ({
  x: window.pageXOffset || document.documentElement.scrollLeft,
  y: window.pageYOffset || document.documentElement.scrollTop,
});

export default getWindowScrollCoordinates;
