import { RefObject } from 'react';

export type ElementOrReference =
  | RefObject<HTMLElement | undefined | null>
  | null
  | HTMLElement
  | undefined;

export type GetElementReturn = HTMLElement | undefined | null;

const getElementFromReference = (element: ElementOrReference): GetElementReturn => {
  return element && 'current' in element && element.current instanceof HTMLElement
    ? element.current
    : element instanceof HTMLElement
    ? element
    : null;
};

export default getElementFromReference;
