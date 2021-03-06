import { useCallback, useEffect, useRef } from 'react';
import useEventListener, { UseEventListenerReturn } from '@jwdinker/use-event-listener';
import useSSR from '@jwdinker/use-ssr';
import { UseDragListenerProps, DragEvent, DragElement } from './types';

export * from './types';

function useDragListener(
  element: DragElement,
  {
    onStart = () => {},
    onMove = () => {},
    onEnd = () => {},
    onKeyUp = () => {},
    onKeyDown = () => {},
    mouse = true,
    touch = true,
    pointer = true,
    once = false,
    passive = true,
    capture = false,
  }: UseDragListenerProps
): void {
  const { isBrowser } = useSSR();
  const canDrag = useRef(false);

  const listeners = useRef<UseEventListenerReturn[]>([]);

  const handlers = {
    listen: (): void => {
      canDrag.current = true;
    },
    unlisten: (): void => {
      canDrag.current = false;
    },
  };

  const start = useCallback(
    (event) => {
      onStart(event as DragEvent, handlers);
    },
    [handlers, onStart]
  );

  const move = useCallback(
    (event) => {
      if (canDrag.current) {
        onMove(event as DragEvent, handlers);
      }
    },
    [handlers, onMove]
  );

  const end = useCallback(
    (event) => {
      if (canDrag.current) {
        onEnd(event as DragEvent, handlers);
      }
    },
    [handlers, onEnd]
  );

  const key = useCallback(
    (event) => {
      if (event.type === 'keydown') {
        onKeyDown(event as KeyboardEvent, handlers);
      }
      if (event.type === 'keyup') {
        onKeyUp(event as KeyboardEvent, handlers);
      }
    },
    [handlers, onKeyDown, onKeyUp]
  );

  const _element = element || (isBrowser ? window : null);

  const _window = isBrowser ? window : null;
  const keyable = useEventListener(_window, 'keyup keydown', key);

  const options = { once, passive, capture };

  const touchstart = useEventListener(_element, 'touchstart', start, options);
  const touchmove = useEventListener(_element, 'touchmove', move, options);
  const touchend = useEventListener(_element, 'touchend touchcancel', end, options);

  const pointerDown = useEventListener(_element, 'pointerdown', start, options);
  const pointerMove = useEventListener(_element, 'pointermove', move, options);
  const pointerUp = useEventListener(_element, 'pointerup', end, options);

  const mousedown = useEventListener(_element, 'mousedown', start);
  const mousemove = useEventListener(_window, 'mousemove', move);
  const mouseup = useEventListener(_window, 'mouseup', end);

  useEffect(() => {
    if (pointer) {
      listeners.current.push(pointerDown, pointerMove, pointerUp);
    }

    if (mouse) {
      listeners.current.push(mousedown, mousemove, mouseup);
    }

    if (touch) {
      listeners.current.push(touchstart, touchmove, touchend);
    }

    listeners.current.forEach((listener) => listener.attach());
    return () => {
      listeners.current.forEach((listener) => listener.detach());
    };
  }, [
    keyable,
    mouse,
    mousedown,
    mousemove,
    mouseup,
    pointer,
    pointerDown,
    pointerMove,
    pointerUp,
    touch,
    touchend,
    touchmove,
    touchstart,
  ]);
}

export default useDragListener;
