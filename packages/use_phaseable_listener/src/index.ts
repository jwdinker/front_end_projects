import { useRef, RefObject, useCallback } from 'react';
import useEventListener, { UseEventListenerReturn } from '@jwdinker/use-event-listener';
import useSSR from '@jwdinker/use-ssr';
import useTimeout from '@jwdinker/use-timeout';

export type OnPhaseStart = (event: any) => void;
export type OnPhaseMove = (event: any) => void;
export type OnPhaseEnd = () => void;

export interface UseDragListenerProps {
  onStart?: OnPhaseStart;
  onMove?: OnPhaseMove;
  onEnd?: OnPhaseEnd;
  endDelay?: number;
  type: string;
  once?: boolean;
  passive?: boolean;
  capture?: boolean;
}

export type PhaseableElement = RefObject<HTMLElement | undefined | null>;

function usePhaseableListener<T>(
  element: PhaseableElement,
  {
    onStart = () => {},
    onMove = () => {},
    onEnd = () => {},
    endDelay = 45,
    type = 'scroll',
    once = false,
    passive = true,
    capture = false,
  }: UseDragListenerProps
): UseEventListenerReturn {
  const { isBrowser } = useSSR();
  const isActive = useRef(false);

  const end = useCallback(() => {
    isActive.current = false;
    onEnd();
  }, [onEnd]);

  const [start, clear] = useTimeout(end, endDelay);

  const delegator = (event: any): void => {
    clear();
    start();
    if (!isActive.current) {
      isActive.current = true;
      return onStart(event as T);
    }
    return onMove(event as T);
  };

  const listener = useEventListener(element, type, delegator, { passive, capture, once });

  return listener;
}

export default usePhaseableListener;
