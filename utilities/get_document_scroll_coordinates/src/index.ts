export interface ScrollCoordinates {
  x: number;
  y: number;
}

const getDocumentScrollCoordinates = (): ScrollCoordinates => ({
  x: document.body.scrollLeft || document.documentElement.scrollLeft,
  y: document.body.scrollTop || document.documentElement.scrollTop,
});

export default getDocumentScrollCoordinates;
