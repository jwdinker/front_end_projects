import { useEffect, useRef } from 'react';

import getElement, { ElementOrReference } from '@jwdinker/get-element-or-reference';
import { getAllScrollableAncestors, ScrollableAncestors } from '@jwdinker/get-scrollable-ancestor';

type ScrollHandler = (event: Event) => void;

type AncestorScrollListenerElement = ElementOrReference | ElementOrReference[];

const SCROLL_EVENT = 'scroll';

export { ElementOrReference } from '@jwdinker/get-element-or-reference';
export { default as getElement } from '@jwdinker/get-element-or-reference';

const getScrollables = (
  elements: ElementOrReference | ElementOrReference[]
): ScrollableAncestors => {
  if (Array.isArray(elements)) {
    let scrollables: ScrollableAncestors = [];
    for (let i = 0; i < elements.length; i += 1) {
      const element = getElement(elements[i]);
      if (element instanceof HTMLElement) {
        const ancestors = getAllScrollableAncestors(element);
        scrollables = scrollables.concat(ancestors);
      }
    }

    const set = new Set(scrollables);
    return [...set];
  }

  if (elements instanceof HTMLElement) {
    return getAllScrollableAncestors(elements);
  }
  return [];
};

function useAncestorsScrollListener(
  element: AncestorScrollListenerElement,
  callback: ScrollHandler,
  { passive = true, capture = true, once = false }: AddEventListenerOptions = {}
): void {
  const saved = useRef<ScrollHandler | null>(null);

  useEffect(() => {
    saved.current = callback;
    return () => {
      saved.current = null;
    };
  }, [callback]);

  const dependencies = Array.isArray(element)
    ? [...element, capture, once, passive]
    : [element, capture, once, passive];

  useEffect(() => {
    const ancestors = getScrollables(element);

    const options = { passive, capture, once };

    const _handler = (event: Event): void => {
      if (saved.current) {
        saved.current(event);
      }
    };

    ancestors.forEach((ancestor) => {
      ancestor.addEventListener(SCROLL_EVENT, _handler, options);
    });

    return () => {
      ancestors.forEach((ancestor) => {
        ancestor.addEventListener(SCROLL_EVENT, _handler, options);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies]);
}

export default useAncestorsScrollListener;
