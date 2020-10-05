import { ScrollDimensions, ScrollableElement } from './types';

import getWindowScrollDimensions from './get_window_scroll_dimensions';
import getDocumentScrollDimensions from './get_document_scroll_dimensions';
import getElementScrollDimensions from './get_element_scroll_dimensions';

function getScrollDimensions(
  element: ScrollableElement,
  includeScrollBar = true
): ScrollDimensions {
  if (element === window) {
    return getWindowScrollDimensions(includeScrollBar);
  }

  if (element === document.body) {
    return getDocumentScrollDimensions();
  }

  if (element instanceof HTMLElement) {
    return getElementScrollDimensions(element, includeScrollBar);
  }

  return {
    height: 0,
    width: 0,
  };
}

export default getScrollDimensions;
