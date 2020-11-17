import { useEffect, useRef } from 'react';

import { getAllScrollableAncestors, ScrollableAncestors } from '@jwdinker/get-scrollable-ancestor';
import useElementReferencesChange, {
  ReferenceCallback,
  ElementOrReference,
} from '@jwdinker/use-element-references-change';
import getSupportedEventOptions from '@jwdinker/get-supported-event-options';

type ScrollHandler = (event: Event) => void;

export { ScrollableAncestor } from '@jwdinker/get-scrollable-ancestor';
export { default as getScrollableAncestor } from '@jwdinker/get-scrollable-ancestor';

const SCROLL_EVENT = 'scroll';

export { ElementOrReference } from '@jwdinker/get-element-or-reference';
export { default as getElement } from '@jwdinker/get-element-or-reference';

// All scroll ancestors are gathered from the array of elements.  The duplicates
// are removed.
const getScrollables = (elements: Element[]): ScrollableAncestors => {
  let scrollables: ScrollableAncestors = [];
  for (let i = 0; i < elements.length; i += 1) {
    const element = elements[i];
    if (element instanceof HTMLElement) {
      const ancestors = getAllScrollableAncestors(element);
      scrollables = scrollables.concat(ancestors);
    }
  }

  const set = new Set(scrollables);
  return [...set];
};

function useAncestorsScrollListener(
  element: ElementOrReference | ElementOrReference[],
  callback: ScrollHandler,
  { passive = true, capture = true, once = false }: AddEventListenerOptions = {}
): void {
  const _callback = useRef<ScrollHandler | null>(callback);

  /*
   The scroll event handler is saved in a reference since I want listeners to be
   toggled by separate callbacks in useElementReferencesChanged. 
  */
  const _handler = useRef<ScrollHandler>((event: Event) => {
    if (_callback.current) {
      _callback.current(event);
    }
  });
  const _ancestors = useRef<ScrollableAncestors>([]);

  // The callback is saved in a reference on each effect.
  useEffect(() => {
    _callback.current = callback;
  }, [callback]);

  /**
   *
   * @param references contains an array of arrays with each array containing an
   * index and value of an element. When a element is attached to a reference:
   *
   * - All the scrollable ancestors will be found, duplicate ancestors will be removed.
   * - A scroll listener is attached to each of the scroll ancestors, including the window.
   * - This process is toggled if any of the references change which probably wouldn't happen much.
   */
  const attach: ReferenceCallback = (references) => {
    // The elements are filtered out of their nested array.
    const elements = references.map((indexAndElement) => indexAndElement[1]);

    _ancestors.current = getScrollables(elements);

    _ancestors.current.forEach((ancestor) => {
      ancestor.addEventListener(
        SCROLL_EVENT,
        _handler.current,
        getSupportedEventOptions({ passive, capture, once })
      );
    });
  };

  /**
   *
   * @param references contains an array of arrays with each array containing an
   * index and value of an element.  It is called when a node reference is
   * removed (goes from Element to null).  I imagine this will rarely execute,
   * but on the off chance an element reference from a different path in the
   * tree is passed in, the listener attached to it should be removed.
   * ! Might want to add a duplicate check since I'm merging listeners and one might be shared.
   */
  const removeSpecificListener: ReferenceCallback = (references) => {
    const removedElements = references.map((indexAndElement) => indexAndElement[1]);
    _ancestors.current.forEach((ancestor) => {
      const isMatch = removedElements.some((removedElement) => removedElement === ancestor);
      if (isMatch) {
        ancestor.removeEventListener(SCROLL_EVENT, _handler.current);
      }
    });
  };

  const detach = () => {
    _ancestors.current.forEach((ancestor) => {
      ancestor.removeEventListener(SCROLL_EVENT, _handler.current);
    });
  };

  useElementReferencesChange(element, {
    onReference: attach,
    onDereference: removeSpecificListener,
    onUnmount: detach,
  });
}

export default useAncestorsScrollListener;
