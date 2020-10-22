import React from 'react';

import useEventListener from '@jwdinker/use-event-listener';
import useRequestAnimationFrameState from '@jwdinker/use-request-animation-frame-state';

import { getScrollCoordinates } from '@jwdinker/scroll-helpers';

export type ScrollElement =
  | React.RefObject<HTMLElement | Window | Document | null | undefined>
  | HTMLElement
  | Window
  | Document
  | null
  | undefined;

export interface ScrollCoordinates {
  x: number;
  y: number;
}
const { useEffect } = React;

function useScrollCoordinates(
  element: ScrollElement = null,
  { passive = true, capture = false, once = false, consolidate = true } = {}
): ScrollCoordinates {
  const [scroll, setScroll] = useRequestAnimationFrameState({ x: 0, y: 0 });

  const handler = (event: any) => {
    setScroll(() => {
      const coordinates = getScrollCoordinates(event.target);
      return coordinates;
    });
  };

  const listener = useEventListener(element, 'scroll', handler, {
    passive,
    capture,
    once,
    consolidate,
  });

  useEffect(() => {
    listener.attach();
    return () => {
      listener.detach();
    };
  }, [listener]);

  return scroll;
}

export default useScrollCoordinates;
