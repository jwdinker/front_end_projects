import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import useScrollSize from '@jwdinker/use-scroll-size';
import useScroll from '@jwdinker/use-scroll';
import useWindowSize from '@jwdinker/use-window-size';
import useOffsets from '@jwdinker/use-offsets';
import useSSR from '@jwdinker/use-ssr';
import Context from './context';
import { WatchTowerProps, Target, WatchTowerContext } from './types';

/*
WatchTower
-------------
The roles of WatchTower is to:
  1. Notify context consumers that their scrollable ancestor's scroll or
       container dimensions have changed.  Consequently, consumers should
       remeasure their offsets. 
  2. Provide the consumers with:
     - the scroll top and left offsets so the consumers can dynamically
         calculate their offsets (avoids performance overhead of
         getBoundingClientRect). 
     - scrollable dimensions. 
     - ancestor dimensions. 

  Essentially, the WatchTower has a one to many relationship with useOffsets hooks.
*/

function WatchTower({ children = null, interval = 500, scrollable = null }: WatchTowerProps = {}) {
  const { isBrowser } = useSSR();

  const getTarget = useCallback(() => {
    return scrollable && 'current' in scrollable && scrollable.current instanceof HTMLElement
      ? scrollable.current
      : scrollable instanceof HTMLElement
      ? scrollable
      : null;
  }, [scrollable]);

  const target = useRef<Target>(null);
  useEffect(() => {
    target.current = getTarget();
  }, [scrollable, isBrowser]);

  const [container, remeasure] = useOffsets(target);

  /*
  useScrollSize
  -----------
  Using a recursive requestAnimationFrame, useScrollSize continuously checks the
  scroll area.  A simple boolean is used to notify context consumers of when the
  size has changed so the beacon children know to remeasure their offsets.
  Having tried all sorts of hacks, this is by far the best way to handle dynamic
  sizing scrollables because it: 
  1. Avoids special classnames for onload scrollables. 
  2. Avoids recursively cloning children and checking for onload tag scrollables
       and subsequently adding onLoad callbacks.
*/
  const [scrollDimensions, hasScrollSizeChanged] = useScrollSize(scrollable);

  /*
  useScroll
  ------------
  continuously updates the top and left offset state.  These values
  are used by the useOffsets hook to calculate the real position of the context
  consumer scrollables.   
  */
  const [scroll] = useScroll(scrollable);

  /*
  useWindowSize
  ------------
  Since the scrollable area can be static and the children scrollables can be based
  of the scrollable ancestor's height or width, a window resize listener needs
  to be added to account for changing offsets of scrollables when the scrollable
  area is static. 
  */
  const [windowDimensions, hasWindowSizeChanged] = useWindowSize(interval);

  // A change can occur when the scroll size changes or the window size changes
  const changed = hasWindowSizeChanged || hasScrollSizeChanged;

  useEffect(() => {
    if (changed && isBrowser && target.current) {
      remeasure();
    }
  }, [changed, isBrowser, remeasure]);

  const value = useMemo((): WatchTowerContext => {
    return [
      {
        container: isBrowser && !target.current ? windowDimensions : container,
        scroll: {
          ...scroll,
          ...scrollDimensions,
        },
      },
      changed,
    ];
  }, [changed, container, isBrowser, scroll, scrollDimensions, windowDimensions]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

WatchTower.displayName = 'WatchTower';

export default WatchTower;
