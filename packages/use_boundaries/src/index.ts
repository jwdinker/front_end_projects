import useBoundingClientRect from '@jwdinker/use-bounding-client-rect';
import useWindowSize from '@jwdinker/use-window-size';
import useScroll from '@jwdinker/use-scroll';
import { useMemo, useEffect, useRef } from 'react';
import { Boundaries, BoundaryElement } from './types';
import { getScrollableAncestor, mergeViewportScrollWithWindowRect } from './helpers';

/**
 *
 * @param element The element that is used to generate boundaries.  The viewport
 * is used by default if no element reference is passed in.  If an element
 * reference is passed in, the overflowing ancestor will be used unless disabled
 * with the second parameter.
 * @param useOverflowAncestor Boolean for enabling and disabling the use of the overflowing
 * ancestor of the element as a boundary.
 */
function useBoundaries(element: BoundaryElement = null, useOverflowAncestor = true): Boundaries {
  const ancestor = useRef<HTMLElement | Window | null>(null);
  const _element = useRef<HTMLElement | null>(null);
  const _window = useRef<Window | null>(null);
  const [windowRectangle] = useWindowSize();

  useEffect(() => {
    // I have to add this messy bull shit logic to please the typescript gods.
    if (element && 'current' in element && element.current) {
      if (!useOverflowAncestor && element.current instanceof HTMLElement) {
        _element.current = element.current;
      } else {
        ancestor.current = getScrollableAncestor(element.current);

        if (ancestor.current === window) {
          _window.current = window;
        }
        if (ancestor.current instanceof HTMLElement) {
          _element.current = ancestor.current;
        }
      }
    } else {
      _window.current = window;
    }
  }, [element, useOverflowAncestor]);

  const [scroll] = useScroll(_window);

  const [rectangle, watch] = useBoundingClientRect(
    _element,
    useMemo(() => ({ addPageOffsets: true, toggable: true }), [])
  );

  useEffect(() => {
    if (_element.current) {
      watch();
    }
  }, [watch]);

  return _element.current ? rectangle : mergeViewportScrollWithWindowRect(windowRectangle, scroll);
}

export default useBoundaries;
