import { RefObject } from 'react';

export type ElementOrReference =
  | RefObject<HTMLElement | undefined | null>
  | null
  | HTMLElement
  | undefined;

export type GetElementReturn = HTMLElement | undefined | null;

const getElementFromReference = (element: ElementOrReference): GetElementReturn => {
  if (typeof window !== 'undefined') {
    if (element) {
      if ('current' in element && element.current instanceof HTMLElement) {
        return element.current;
      }
      if (element instanceof HTMLElement) {
        return element;
      }
    }
  }
  return null;
};

export default getElementFromReference;
