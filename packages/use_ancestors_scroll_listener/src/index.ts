import { useEffect, useRef } from 'react';

import getElement, { ElementOrReference } from '@jwdinker/get-element-or-reference';
import { getAllScrollableAncestors } from '@jwdinker/get-scrollable-ancestor';

type ScrollHandler = (event: Event) => void;

const SCROLL_EVENT = 'scroll';

export { ElementOrReference } from '@jwdinker/get-element-or-reference';
export { default as getElement } from '@jwdinker/get-element-or-reference';

function useAncestorsScrollListener(
  element: ElementOrReference,
  handler: ScrollHandler,
  { passive = true, capture = true, once = false }: AddEventListenerOptions = {}
): void {
  const ancestors = useRef<HTMLElement[] | undefined>();

  const saved = useRef<ScrollHandler>(handler);

  useEffect(() => {
    saved.current = handler;
  }, [handler]);

  useEffect(() => {
    const _element = getElement(element);
    if (_element) {
      ancestors.current = getAllScrollableAncestors(_element);

      const options = { passive, capture, once };

      const _handler = (event: Event): void => saved.current(event);

      if (ancestors.current && ancestors.current.length > 0) {
        ancestors.current.forEach((ancestor) => {
          ancestor.addEventListener(SCROLL_EVENT, _handler, options);
        });
      }

      window.addEventListener(SCROLL_EVENT, _handler, options);

      document.body.addEventListener(SCROLL_EVENT, _handler, options);

      return (): void => {
        if (ancestors.current && ancestors.current.length > 0) {
          ancestors.current.forEach((ancestor) => {
            ancestor.addEventListener(SCROLL_EVENT, _handler, options);
          });
        }

        window.removeEventListener(SCROLL_EVENT, _handler);
        document.body.removeEventListener(SCROLL_EVENT, _handler);
      };
    }
  }, [capture, element, handler, once, passive]);
}

export default useAncestorsScrollListener;
