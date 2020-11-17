export interface ScrollCoordinates {
  x: number;
  y: number;
}

const getWindowScrollCoordinates = (): ScrollCoordinates => ({
  x: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
  y: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
});

export default getWindowScrollCoordinates;
