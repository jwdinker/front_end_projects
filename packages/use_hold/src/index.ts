import * as React from 'react';
import useEventListener, { UseEventListenerReturn } from '@jwdinker/use-event-listener';

import useInterval from '@jwdinker/use-interval';
import useBoundingClientRect from '@jwdinker/use-bounding-client-rect';
import get1TouchCoordinates from '@jwdinker/get-1-touch-coordinates';
import getMouseCoordinates from '@jwdinker/get-mouse-coordinates';
import { inBounds } from '@jwdinker/in-bounds';

export type HoldableElement = React.RefObject<HTMLElement | undefined | null>;

export type HoldCallback<T> = () => void;

export type OnThreshold = () => void;

export type OnHolding = (elapsedTime: number) => void;

export interface UseHoldProps {
  onThreshold?: OnThreshold;
  onRelease?: () => void;
  onHolding?: OnHolding;
  threshold?: number;
  touch?: boolean;
  mouse?: boolean;
  consolidate?: boolean;
}

const { useRef, useEffect } = React;

function useHold(
  element: HoldableElement,
  {
    threshold = 300,
    onThreshold = () => {},
    onHolding = () => {},
    onRelease = () => {},
    mouse = true,
    touch = true,
    consolidate = false,
  }: UseHoldProps
): void {
  const active = useRef(false);
  const [rect, updateRect] = useBoundingClientRect(element);

  const options = { consolidate };

  const [start, stop] = useInterval({
    interval: threshold,
    onWait: (elapsed) => {
      onHolding(elapsed);
    },
    onInterval: (time, forceStop) => {
      forceStop();
      onThreshold();
    },
  });

  const begin = () => {
    start();
    active.current = true;
    updateRect();
  };

  const handleBounds = (coordinates: number[]) => {
    const [x, y] = coordinates;

    if (!inBounds({ top: y, left: x, height: 0, width: 0 }, rect)) {
      stop();
      onRelease();
      active.current = false;
    }
  };

  const mouseInBounds = (event: unknown) => {
    if (active.current) {
      const coordinates = getMouseCoordinates(event as MouseEvent);
      handleBounds(coordinates);
    }
  };

  const touchInBounds = (event: unknown) => {
    if (active.current) {
      const coordinates = get1TouchCoordinates(event as TouchEvent, 'client');
      handleBounds(coordinates);
    }
  };

  const _window = typeof window !== 'undefined' ? window : null;

  const touchstart = useEventListener(element, 'touchstart', begin, options);
  const touchmove = useEventListener(_window, 'touchmove', touchInBounds, options);

  const mousedown = useEventListener(element, 'mousedown', begin, options);
  const mousemove = useEventListener(_window, 'mousemove', mouseInBounds, options);

  const endable = useEventListener(
    _window,
    'mouseup touchend',
    () => {
      if (active.current) {
        active.current = false;
        onRelease();
        stop();
      }
    },
    options
  );

  useEffect(() => {
    const listeners: UseEventListenerReturn[] = [];
    if (mouse) {
      listeners.push(mousedown, mousemove);
    }
    if (touch) {
      listeners.push(touchstart, touchmove);
    }

    if (mouse || touch) {
      listeners.push(endable);
    }

    listeners.forEach((listener) => {
      listener.attach();
    });

    return () => {
      listeners.forEach((listener) => {
        listener.detach();
      });
    };
  }, [endable, mouse, mousedown, mousemove, touch, touchmove, touchstart]);
}

export default useHold;
