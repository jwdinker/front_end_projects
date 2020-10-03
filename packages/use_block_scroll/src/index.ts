import * as React from 'react';
import useEventListener, { UseEventListenerReturn } from '@jwdinker/use-event-listener';
import { UseBlockScrollOptions, UseBlockScrollReturn, BlockableElement } from './types';
import { makeBlockable } from './helpers';

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
      const saved = style.current || 'visible';

      document.body.style.overflow = saved;
      style.current = '';
    }
  }, []);

  return { prevent, restore };
}

function useBlockScroll(
  element: BlockableElement,
  { blockable = 'y' }: UseBlockScrollOptions = {}
): UseBlockScrollReturn {
  const coordinates = useRef({ x: 0, y: 0 });
  const listeners = useRef<UseEventListenerReturn[]>([]);

  const isBlockable = useMemo(() => makeBlockable(blockable), [blockable]);

  const overflow = useOverflowPrevention();

  const preventMoveOnBody = (event: any) => {
    event.preventDefault();
    return false;
  };

  const start = (event: any) => {
    coordinates.current.x = event.targetTouches[0].clientX;
    coordinates.current.y = event.targetTouches[0].clientY;
  };

  const move = (event: any): boolean => {
    const { currentTarget, targetTouches } = event;

    if (currentTarget instanceof HTMLElement) {
      const canBlock = isBlockable(currentTarget, targetTouches, coordinates.current);

      if (canBlock) {
        event.preventDefault();

        return false;
      }

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
  const touchmove = useEventListener(element, TOUCH_MOVE, move, OPTIONS);

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
  const block = useCallback(() => {
    overflow.prevent();
    listeners.current.forEach((listener) => listener.attach());
  }, [overflow]);

  const unblock = useCallback(() => {
    overflow.restore();
    listeners.current.forEach((listener) => listener.detach());
  }, [overflow]);

  return [block, unblock];
}

export default useBlockScroll;
