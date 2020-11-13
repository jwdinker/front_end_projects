import { useState, useMemo, useCallback, useEffect } from 'react';
import useEventListener from '@jwdinker/use-event-listener';
import useTimeout from '@jwdinker/use-timeout';
import useSSR from '@jwdinker/use-ssr';
import getWindowRectangle, { WindowRectangle } from '@jwdinker/get-window-rectangle';

export { WindowRectangle } from '@jwdinker/get-window-rectangle';

/**
 *
 * @param endDelay The duration of time waited between window resize events before the end is set to end.
 *
 */
function useWindowSize(endDelay = 200): [WindowRectangle, boolean] {
  const { isBrowser } = useSSR();
  const [resized, setResized] = useState(false);

  const [size, setSize] = useState(() => {
    return {
      height: 0,
      width: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };
  });

  const end = useCallback(() => {
    setResized(true);
  }, []);

  const [start, clear] = useTimeout(end, endDelay);

  const handler = useCallback(() => {
    clear();
    start();
    setSize(getWindowRectangle());
  }, [clear, start]);

  useEffect(() => {
    if (isBrowser) {
      setSize(getWindowRectangle());
    }
  }, [isBrowser]);

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

  const options = useMemo(() => {
    return { consolidate: true };
  }, []);

  const { attach, detach } = useEventListener(
    isBrowser ? window : null,
    'resize',
    handler,
    options
  );

  useEffect(() => {
    attach();
    return detach;
  }, [attach, detach]);

  return [size, resized];
}

export default useWindowSize;
