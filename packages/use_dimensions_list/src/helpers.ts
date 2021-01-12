export const getDimensions = (element: HTMLElement) => {
  return {
    height: element.offsetHeight,
    width: element.offsetWidth,
  };
};
