import getDocumentScrollCoordinates from '@jwdinker/get-document-scroll-coordinates';

export function getAnchorMeasurements(
  anchorReference: HTMLElement,
  ancestorReference: HTMLElement
) {
  const anchor = anchorReference.getBoundingClientRect();
  const { width, height } = anchor;
  const isDocument = ancestorReference === document.documentElement;
  let scrollLeft = 0;
  let scrollTop = 0;
  if (isDocument) {
    const { x, y } = getDocumentScrollCoordinates();
    scrollLeft = x;
    scrollTop = y;
  }
  const ancestor = ancestorReference.getBoundingClientRect();
  return {
    left: anchor.left - ancestor.left - scrollLeft,
    top: anchor.top - ancestor.top - scrollTop,
    width,
    height,
  };
}
