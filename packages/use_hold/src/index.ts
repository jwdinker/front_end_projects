import { useRef, RefObject } from 'react';
import useEventListener, { UseEventListenerReturn } from '@jwdinker/use-event-listener';

import useTimeout from '@jwdinker/use-timeout';

export type HoldableElement = RefObject<HTMLElement | undefined | null>;

export type HoldCallback<T> = (event: T) => void;

export interface UseHoldProps {
  onHold?: HoldCallback<MouseEvent | TouchEvent>;
  onTouchHold?: HoldCallback<TouchEvent>;
  onMouseHold?: HoldCallback<MouseEvent>;
  hold?: number;
}

export interface UseHoldReturn {
  touchable: UseEventListenerReturn;
  mouseable: UseEventListenerReturn;
}

function useHold(
  element: HoldableElement,
  { hold = 300, onHold = () => {}, onMouseHold = () => {}, onTouchHold = () => {} }: UseHoldProps
): UseHoldReturn {
  const _event = useRef<TouchEvent | MouseEvent | undefined>();

  const execute = () => {
    const event = _event.current;
    if (event) {
      onHold(event);

      const { type } = event;
      if (type === 'touchstart') {
        onTouchHold(event as TouchEvent);
      }

      if (type === 'mousedown') {
        onMouseHold(event as MouseEvent);
      }
    }
  };
  const [start, clear] = useTimeout(execute, hold);

  const touchstart = (event: TouchEvent) => {
    const { type } = event;
    if (type === 'touchstart') {
      _event.current = event;
      clear();
      start();

      return;
    }

    clear();
  };

  const mousedown = (event: MouseEvent) => {
    const { type } = event;
    if (type === 'mousedown') {
      _event.current = event;
      clear();
      start();

      return;
    }

    clear();
  };
  // @ts-ignore
  const touchable = useEventListener(element, 'touchstart touchmove touchend', touchstart);
  // @ts-ignore
  const mouseable = useEventListener(element, 'mousedown mousemove mouseup', mousedown);

  return {
    touchable,
    mouseable,
  };
}

export default useHold;
