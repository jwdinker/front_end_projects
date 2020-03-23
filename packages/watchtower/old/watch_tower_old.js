import React, { useCallback, useState, useRef, useEffect, useMemo, forwardRef } from 'react';
import useAnimationFrame from '@jwdinker/use-animation-frame';
import useEventListener from '@jwdinker/use-event-listener';
import Context from './context';
import { getScrollDimensions, getMeasurements, getScrollOffsets, makeHasChanged } from './helpers';
import { SIZE_PROPS, EVENT_TYPES, INITIAL_MEASUREMENTS, INITIAL_SCROLL_OFFSETS } from './constants';

const hasChanged = makeHasChanged(SIZE_PROPS);

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

const WatchTower = forwardRef(({ children, interval }, element) => {
  const [{ height, width }, setScrollDimensions] = useState(() => ({ height: 0, width: 0 }));
  const [{ top, left, delta }, setScrollOffsets] = useState(INITIAL_SCROLL_OFFSETS);
  const [measurements, setMeasurements] = useState(INITIAL_MEASUREMENTS);
  const [changed, setChanged] = useState(false);
  const target = useRef();

  /*
  UNIFIES WINDOW & ELEMENTS INTO SINGLE REF
  -----------------------------------------
  target.current is used to unify window and element refs into a single
  'current' property since useEffect will only pick up changes to 'current'.
  */

  useEffect(() => {
    target.current = element
      ? element === window || element.current === window
        ? window
        : element.current
      : null;
  }, [element]);

  /*
RESETS CHANGED TOGGLE IF TRUE
-----------------------------
Instead of doing potentially hundreds of equality checks inside the useOffset
hook to check if the scroll dimension size matches the previous scroll
dimension size, I decided to just reset the boolean on the next render.
*/
  useEffect(() => {
    if (changed) {
      setChanged(false);
    }
  }, [changed]);

  /*
  SETS INITIAL MEASUREMENTS OF SCROLL ANCESTOR
  --------------------------------------------
  Instead of doing potentially hundreds of equality checks inside the useOffset
  hook to check if the scroll dimension size matches the previous scroll
  dimension size, I decided to just reset the boolean on the next render if it's
  set to true.
  */
  useEffect(() => {
    if (target.current) {
      setMeasurements(getMeasurements(target.current));
    }
  }, []);

  /*
  handleFrame
  -----------
  Using a recursive requestAnimationFrame, handleFrame continuously checks the
  scroll area.  A simple boolean is used to notify context consumers of when the
  size has changed so the beacon children know to remeasure their offsets.
  Having tried all sorts of hacks, this is by far the best way to handle dynamic
  sizing elements because it: 
  1. Avoids special classnames for onload elements. 
  2. Avoids recursively cloning children and checking for onload tag elements
       and subsequently adding onLoad callbacks.

  Besides a complete reduction in complexity, the performance is way better than
  the methods above.The only downside is a there can be several re-renders on
  initial document load. 
  */
  const handleFrame = useCallback(() => {
    const nextScrollDimensions = getScrollDimensions(target.current);
    if (hasChanged({ height, width }, nextScrollDimensions)) {
      setMeasurements(getMeasurements(target.current));
      setScrollDimensions(nextScrollDimensions);
      setChanged(true);
    }
  }, [height, width]);

  /*
  handleResize
  ------------
  Since the scrollable area can be static and the children elements can be based
  of the scrollable ancestor's height or width, a resize listener needs to be
  added to account for changing offsets of elements when the scrollable area is
  static. 
  */
  const handleResize = useCallback(() => {
    const nextMeasurements = getMeasurements(target.current);
    if (hasChanged(measurements, nextMeasurements)) {
      setMeasurements(nextMeasurements);
      setChanged(true);
    }
  }, [measurements]);

  /*
  handleScroll
  ------------
  handleScroll continuously updates the top and left offset state.  These values
  are used by the useOffsets hook to calculate the real position of the context
  consumer elements.   
  */
  const handleScroll = useCallback(() => {
    const offsets = getScrollOffsets(target.current);
    setScrollOffsets((previous) => ({
      top: offsets.top,
      left: offsets.left,
      delta: {
        top: previous.top,
        left: previous.left,
      },
    }));
  }, []);

  useAnimationFrame(
    useMemo(
      () => ({
        delay: interval,
        onFrame: handleFrame,
      }),
      [handleFrame, interval]
    )
  );

  useEventListener(
    useMemo(
      () => ({
        target,
        type: EVENT_TYPES.SCROLL,
        handler: handleScroll,
        consolidate: true,
        passive: true,
      }),
      [handleScroll]
    )
  );

  useEventListener(
    useMemo(
      () => ({
        target: typeof window !== 'undefined' && window,
        type: EVENT_TYPES.RESIZE,
        handler: handleResize,
        consolidate: true,
        passive: true,
      }),
      [handleResize]
    )
  );

  const value = useMemo(() => {
    return {
      changed,
      container: measurements,
      scroll: {
        top,
        left,
        delta,
        height,
        width,
      },
    };
  }, [changed, delta, height, left, measurements, top, width]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
});

WatchTower.defaultProps = {
  children: null,
  interval: 500,
};

WatchTower.displayName = 'WatchTower';

export default WatchTower;
