export type HTMLElementReference = React.RefObject<HTMLElement | undefined | null>;

export type GetHTMLElementReferenceReturn = HTMLElement | undefined | null;

function getHTMLElementReference(element: HTMLElementReference): HTMLElement | null | undefined {
  if (element && 'current' in element) {
    if (element.current instanceof HTMLElement) {
      return element.current;
    }
    return element.current;
  }
  return null;
}

export default getHTMLElementReference;
