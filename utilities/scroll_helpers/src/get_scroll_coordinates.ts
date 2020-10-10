import { ScrollCoordinates, ScrollableElement } from './types';
import getWindowScrollCoordinates from './get_window_scroll_coordinates';
import getDocumentScrollCoordinates from './get_document_scroll_coordinates';
import getElementScrollCoordinates from './get_element_scroll_coordinates';

const getScrollCoordinates = (element: ScrollableElement): ScrollCoordinates => {
  if (element === window) {
    return getWindowScrollCoordinates();
  }

  if (element === document) {
    return getDocumentScrollCoordinates();
  }

  if (element instanceof HTMLElement) {
    return getElementScrollCoordinates(element);
  }

  return {
    x: 0,
    y: 0,
  };
};

export default getScrollCoordinates;
