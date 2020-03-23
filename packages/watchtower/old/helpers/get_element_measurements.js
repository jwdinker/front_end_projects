import getPosition from './get_position';

function getElementMeasurements(element) {
  const { top, left } = getPosition(element);
  const { offsetHeight, offsetWidth } = element;
  const height = offsetHeight;
  const width = offsetWidth;
  return {
    height,
    width,
    top,
    left,
    bottom: top + height,
    right: left + width,
  };
}

export default getElementMeasurements;
