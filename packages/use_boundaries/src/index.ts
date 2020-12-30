import * as React from 'react';
import useElementReferencesChange, {
  ReferenceCallback,
  ElementOrReference,
} from '@jwdinker/use-element-references-change';
import { getAllScrollableAncestors, ScrollableAncestors } from '@jwdinker/get-scrollable-ancestor';
import getWindowRectangle from '@jwdinker/get-window-rectangle';
import useRequestAnimationFrameState from '@jwdinker/use-request-animation-frame-state';
import makeHasChanged from '@jwdinker/make-has-changed';
import useDebounceCallback from '@jwdinker/use-debounce-callback';

const { useRef, useEffect, useCallback } = React;

export interface Boundaries {
  top: number;
  left: number;
  height: number;
  width: number;
}

const RECT_PROPS = ['top', 'left', 'height', 'width'];

const hasChanged = makeHasChanged(RECT_PROPS);

export function formatRectangle(rectangle: Boundaries) {
  const { top, left, height, width } = rectangle;
  return { top, left, height, width };
}

const INITIAL_MEASUREMENTS = {
  top: 0,
  left: 0,
  height: 0,
  width: 0,
};

function useBoundaries(from: ElementOrReference = null, resizeDelay = 100): Boundaries {
  const scrollers = useRef<ScrollableAncestors>([]);
  const scrollParentOfReference = useRef<HTMLElement>();

  const [state, setState] = useRequestAnimationFrameState(INITIAL_MEASUREMENTS);

  /**
   * The update function does the following:
   *
   * - Executes on window resize events.
   * - Executes on scroll events of all scrollable ancestors when a an HTML
   *   element is referenced on the 'from' argument AND one of those scrollable
   *   ancestors is an HTML element.
   */
  const update = useCallback(() => {
    setState((previousOffsets) => {
      if (scrollParentOfReference.current instanceof HTMLElement) {
        const offsets = scrollParentOfReference.current.getBoundingClientRect();
        return hasChanged(previousOffsets, offsets) ? formatRectangle(offsets) : previousOffsets;
      }
      return formatRectangle(getWindowRectangle());
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const attach = () => {
    if (scrollers.current.length > 0) {
      scrollers.current.forEach((scroller) => {
        scroller.addEventListener('scroll', update, { passive: true });
      });
    }
  };

  const detach = () => {
    if (scrollers.current.length > 0) {
      scrollers.current.forEach((scroller) => {
        scroller.removeEventListener('scroll', update);
      });
    }
  };

  /**
   * @param references contains an array of index and element pairs.  For this
   * use case only one element will be referenced so it is assumed that the
   * reference is index 0.
   *
   * The onReference callback does the following:
   *
   * - Executes when a an HTML Element is referenced on the 'from' argument.
   * - All the scrollable ancestors are gathered in an array in ascending order.
   * - If the first scrolling element is an html element, the boundaries must
   *   account for both viewport and html element scrolling as there is nested
   *   scrolling, hence the reason for using
   *   scrollParentOfReference.current.getBoundingClientRect() in the update
   *   function.  Furthermore, scroll event listeners must be attached to each
   *   of these scrollable elements.
   * - If the first scrolling element is not an html element, but is instead the
   *   window, the boundaries are simply the viewport rectangle, and no scroll
   *   listeners need to be attached.
   */
  const onReference: ReferenceCallback = (references) => {
    const element = references[0][1];
    scrollers.current = getAllScrollableAncestors(element);
    const firstScrollableElement = scrollers.current[0];

    if (firstScrollableElement instanceof HTMLElement) {
      scrollParentOfReference.current = firstScrollableElement;
      attach();
    } else {
      scrollers.current = [];
      setState(formatRectangle(getWindowRectangle()));
    }
  };

  /* 
    useElementReferencesChange watches for changes when a ref has an html
    element attached to it.  The detach function is executed on onUnount in
    order to remove the scroll event listeners (if there are any) to prevent
    state updates on an unmounted component.  
  */
  useElementReferencesChange(from, { onReference, onDereference: detach });

  /*
    The update function is run once to set the initial boundaries prior to a
    scroll event.  A resize event listener is also attach to account for changing
    boundaries as a result of window size changes.
  */

  const resize = useDebounceCallback(update, resizeDelay);

  useEffect(() => {
    update();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [resize, update]);

  return state;
}

export default useBoundaries;
