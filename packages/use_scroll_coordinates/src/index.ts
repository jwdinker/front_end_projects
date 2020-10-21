import React from 'react';

import useEventListener from '@jwdinker/use-event-listener';

import { getScrollCoordinates } from '@jwdinker/scroll-helpers';

type ScrollElementReference = React.RefObject<HTMLElement | Window | Document | null | undefined>;

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
const { useState, useEffect } = React;

function useScrollCoordinates(
  element: ScrollElement = null,
  { passive = true, capture = false, once = false, consolidate = true } = {}
): ScrollCoordinates {
  const [scroll, setScroll] = useState({ x: 0, y: 0 });

  const handler = (event: any) => {
    const coordinates = getScrollCoordinates(event.target);
    setScroll(coordinates);
  };

  // @ts-ignore
  const listener = useEventListener(element, 'scroll', handler, {
    passive,
    capture,
    once,
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
