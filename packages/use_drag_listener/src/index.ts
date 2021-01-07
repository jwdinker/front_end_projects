import { useEffect, useRef } from 'react';
import useEventListener, { UseEventListenerReturn } from '@jwdinker/use-event-listener';
import useSSR from '@jwdinker/use-ssr';
import { UseDragListenerProps, DragElement } from './types';

export * from './types';

function useDragListener(
  element: DragElement,
  {
    onTouchStart = () => {},
    onTouchMove = () => {},
    onTouchEnd = () => {},
    onMouseDown = () => {},
    onMouseMove = () => {},
    onMouseUp = () => {},
    mouse = true,
    touch = true,
    once = false,
    passive = false,
    capture = false,
  }: UseDragListenerProps = {}
): void {
  const { isBrowser } = useSSR();
  const canDrag = useRef(false);

  const enable = () => {
    canDrag.current = true;
  };

  const disable = () => {
    canDrag.current = false;
  };

  const _element = element || (isBrowser ? window : null);

  const _window = isBrowser ? window : null;

  const options = { once, passive, capture };

  const windowOptions = { once, passive, capture, consolidate: true };

  const touchstart = useEventListener(
    _element,
    'touchstart',
    (event) => {
      onTouchStart(event as TouchEvent, enable);
    },
    options
  );

  const touchmove = useEventListener(
    _element,
    'touchmove',
    (event) => {
      if (canDrag.current) {
        return onTouchMove(event as TouchEvent);
      }
      return undefined;
    },
    options
  );

  const touchend = useEventListener(
    _element,
    'touchend touchcancel',
    (event) => {
      if (canDrag.current) {
        return onTouchEnd(event as TouchEvent, disable);
      }
      return undefined;
    },
    options
  );

  const mousedown = useEventListener(
    _element,
    'mousedown',
    (event) => {
      return onMouseDown(event as MouseEvent, enable);
    },
    options
  );

  const mousemove = useEventListener(
    _window,
    'mousemove',
    (event) => {
      if (canDrag.current) {
        return onMouseMove(event as MouseEvent);
      }
      return undefined;
    },
    windowOptions
  );

  const mouseup = useEventListener(
    _window,
    'mouseup',
    (event) => {
      if (canDrag.current) {
        return onMouseUp(event as MouseEvent, disable);
      }
      return undefined;
    },
    windowOptions
  );

  useEffect(() => {
    const listeners: UseEventListenerReturn[] = [];
    if (mouse) {
      listeners.push(mousedown, mousemove, mouseup);
    }

    if (touch) {
      listeners.push(touchstart, touchmove, touchend);
    }

    listeners.forEach((listener) => listener.attach());
    return () => {
      listeners.forEach((listener) => listener.detach());
    };
  }, [mouse, mousedown, mousemove, mouseup, touch, touchend, touchmove, touchstart]);
}

export default useDragListener;
