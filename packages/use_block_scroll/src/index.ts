import * as React from 'react';
import useEventListener, { UseEventListenerReturn } from '@jwdinker/use-event-listener';
import useTimeout from '@jwdinker/use-timeout';
import { UseBlockScrollOptions, UseBlockScrollReturn, BlockableElement } from './types';
import { makeBlockable, getCoordinates } from './helpers';

const { useMemo, useCallback, useRef, useEffect } = React;

const TOUCH_START = 'touchstart';
const TOUCH_MOVE = 'touchmove';

const isBrowser = typeof window !== 'undefined';

const OPTIONS = { passive: false };

function useOverflowPrevention() {
  const style = useRef<string>('');

  const prevent = useCallback(() => {
    const saved = document.body.style.overflow;
    style.current = saved;

    document.body.style.overflow = 'hidden';
  }, []);

  const restore = useCallback(() => {
    const isHidden = document.body.style.overflow === 'hidden';

    const canRestore = isHidden;

    if (canRestore) {
      const saved = style.current;

      document.body.style.overflow = saved;
      style.current = '';
    }
  }, []);

  return { prevent, restore };
}

function useBlockScroll(
  element: BlockableElement,
  { axis = 'y', onBlock = () => {}, onUnblock = () => {} }: UseBlockScrollOptions = {}
): UseBlockScrollReturn {
  const coordinates = useRef({ x: 0, y: 0 });
  const isBlocking = useRef(false);

  const [startTimeout, removeTimeout] = useTimeout(() => {
    if (isBlocking.current) {
      isBlocking.current = false;
      onUnblock();
      overflow.restore();
    }
  }, 100);

  const listeners = useRef<UseEventListenerReturn[]>([]);

  const isBlockable = useMemo(() => makeBlockable(axis), [axis]);

  const overflow = useOverflowPrevention();

  const preventMoveOnBody = (event: any) => {
    if (isBlocking.current) {
      event.preventDefault();
      return false;
    }
  };

  const start = (event: any) => {
    coordinates.current = getCoordinates(event.targetTouches);
  };

  const move = (event: any): boolean => {
    const { currentTarget, targetTouches } = event;

    if (currentTarget instanceof HTMLElement) {
      const nextCoordinates = getCoordinates(targetTouches);
      const lastCoordinates = coordinates.current;
      const canBlock = isBlockable(currentTarget, nextCoordinates, lastCoordinates);
      coordinates.current = nextCoordinates;

      const hasBlockStarted = canBlock && !isBlocking.current;
      const hasUnblocked = !canBlock && isBlocking.current;

      if (hasBlockStarted) {
        overflow.prevent();
        onBlock();
      }
      if (hasUnblocked) {
        overflow.restore();
        onUnblock();
      }

      if (canBlock) {
        removeTimeout();
        startTimeout();
        isBlocking.current = true;
        event.preventDefault();

        return false;
      }

      isBlocking.current = false;

      /*
       * TO DO - gotta recheck on this.
      ! Important Note
      Not sure if this is expected, or a consequence of react sythentic
      events, but I have run into some bizarre issues with iOS event bubbling
      especially with position fixed. Parents with touchmove event blocking are
      taking precedence over their childrens' touchmove events.  I encountered
      this with scroll blocking enabled on a parent, with a swipable child
      container with images.  Sometimes the images were swipable and other times
      they were not.  Because of this, I have to add some logic for when to
      stopPropagation. 
    */
      // if (!canPropagate) {
      //   event.stopPropagation();
      // }
    }
    return true;
  };

  const body = isBrowser ? document : null;

  const touchstart = useEventListener(element, TOUCH_START, start);
  const touchmove = useEventListener(element, TOUCH_MOVE, move);

  // @ts-ignore
  const documentTouchMove = useEventListener(body, TOUCH_MOVE, preventMoveOnBody, OPTIONS);

  useEffect(() => {
    listeners.current = [touchstart, touchmove, documentTouchMove];
  }, [documentTouchMove, touchmove, touchstart]);

  /*
    The order matters here. Inline events are called after document events so
    react synthetic events won't work.  Events have to be added via vanilla
    javascript in their respective order, otherwise stopPropagation won't work
    and you end up blocking all touchmove events.
  */
  const enable = useCallback(() => {
    listeners.current.forEach((listener) => listener.attach());
  }, []);

  const disable = useCallback(() => {
    listeners.current.forEach((listener) => listener.detach());
  }, []);

  return [enable, disable];
}

export default useBlockScroll;
