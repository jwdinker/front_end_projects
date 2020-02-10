import getElementMeasurements from './get_element_measurements';
import getWindowMeasurements from './get_window_measurements';

function getMeasurements(target) {
  return target === window ? getWindowMeasurements() : getElementMeasurements(target);
}

export default getMeasurements;
