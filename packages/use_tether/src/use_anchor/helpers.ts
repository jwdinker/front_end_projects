import { getContainingBlock } from '@jwdinker/get-containing-block';
import getDocumentScrollCoordinates from '@jwdinker/get-document-scroll-coordinates';

export function getOffsetParent(element: HTMLElement) {
  return element.offsetParent || getContainingBlock(element);
}

export function getAnchorMeasurements(anchorReference: HTMLElement, containerReference: Element) {
  const anchor = anchorReference.getBoundingClientRect();
  const { width, height } = anchor;

  const isDocument = containerReference === document.documentElement;

  let scrollLeft = 0;
  let scrollTop = 0;

  if (isDocument) {
    const { x, y } = getDocumentScrollCoordinates();
    scrollLeft = x;
    scrollTop = y;
  }

  const container = containerReference.getBoundingClientRect();

  return {
    left: anchor.left - container.left - scrollLeft,
    top: anchor.top - container.top - scrollTop,
    width,
    height,
  };
}
