import { useState, useMemo, useCallback, useEffect } from 'react';
import useEventListener from '@jwdinker/use-event-listener';
import useTimeout from '@jwdinker/use-timeout';
import useSSR from '@jwdinker/use-ssr';

/**
 * The normalized measurements of the viewport.
 */
export interface WindowRectangle {
  top: number;
  left: number;
  right: number;
  bottom: number;
  height: number;
  width: number;
}

const getWindowMeasurements = (): WindowRectangle => {
  if (typeof window !== 'undefined') {
    const width =
      window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const height =
      window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    return {
      width,
      height,
      top: 0,
      left: 0,
      right: width,
      bottom: height,
    };
  }
  return {
    height: 0,
    width: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };
};

/**
 *
 * @param endDelay The duration of time waited between window resize events before the end is set to end.
 *
 */
function useWindowSize(endDelay = 200): [WindowRectangle, boolean] {
  const { isBrowser } = useSSR();
  const [resized, setResized] = useState(false);

  const [size, setSize] = useState(() => {
    return getWindowMeasurements();
  });

  const end = useCallback(() => {
    setResized(true);
  }, []);

  const [start, clear] = useTimeout(end, endDelay);

  const handler = useCallback(() => {
    clear();
    start();
    setSize(getWindowMeasurements());
  }, [clear, start]);

  /*
  Using 'resized' is safer than using a continuous resizing:true because using
  this boolean in a useEffect to trigger other calls to setState will result in
  a maximum call stack size exceeded error.  For that reason, setResized is set
  back to false when it is a true for ease of use. 
  */
  useEffect(() => {
    if (resized) {
      setResized(false);
    }
  }, [resized]);

  useEventListener(
    useMemo(
      () => ({
        target: isBrowser ? window : null,
        type: 'resize',
        handler,
        consolidate: true,
      }),
      [handler, isBrowser]
    )
  );

  return [size, resized];
}

export default useWindowSize;
