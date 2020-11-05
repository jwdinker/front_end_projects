import getWindowScrollCoordinates from '@jwdinker/get-window-scroll-coordinates';
import getDocumentScrollCoordinates from '@jwdinker/get-document-scroll-coordinates';
import getElementScrollCoordinates, {
  ScrollCoordinates,
} from '@jwdinker/get-element-scroll-coordinates';

export { ScrollCoordinates } from '@jwdinker/get-element-scroll-coordinates';

export type ScrollableElement = Window | Document | HTMLElement;

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
