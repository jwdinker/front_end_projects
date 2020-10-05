import { ScrollableElement, ScrollMeasurements } from './types';
import getScrollCoordinates from './get_scroll_coordinates';
import getScrollDimensions from './get_scroll_dimensions';

function getScrollMeasurements(
  element: ScrollableElement,
  includeScrollBar = true
): ScrollMeasurements {
  return {
    ...getScrollCoordinates(element),
    ...getScrollDimensions(element, includeScrollBar),
  };
}

export default getScrollMeasurements;
