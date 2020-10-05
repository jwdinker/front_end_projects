export interface Dimensions {
  height: number;
  width: number;
}

export const getElementDimensions = (element: HTMLElement): Dimensions => {
  return {
    height: element.offsetHeight,
    width: element.offsetWidth,
  };
};

export const getWindowDimensions = (): Dimensions => {
  return {
    height:
      window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
    width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
  };
};

export const getDimensions = (
  element: Window | Document['body'] | HTMLElement | null | undefined
): Dimensions => {
  if (element instanceof HTMLElement) {
    return getElementDimensions(element);
  }
  return getWindowDimensions();
};
