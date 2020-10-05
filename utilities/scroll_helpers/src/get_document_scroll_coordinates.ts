import { ScrollCoordinates } from './types';

const getDocumentScrollCoordinates = (): ScrollCoordinates => ({
  x: document.body.scrollLeft,
  y: document.body.scrollTop,
});

export default getDocumentScrollCoordinates;
