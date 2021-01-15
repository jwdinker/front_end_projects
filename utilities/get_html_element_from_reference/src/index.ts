export type HTMLElementReference = React.RefObject<HTMLElement | undefined | null>;

function getHTMLElementReference(element: HTMLElementReference): HTMLElement | null | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }
  if (element && 'current' in element) {
    if (element.current instanceof HTMLElement) {
      return element.current;
    }
    return element.current;
  }
  return null;
}

export default getHTMLElementReference;
