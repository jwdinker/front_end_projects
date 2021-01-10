import { useState, useMemo, useCallback, useEffect } from 'react';
import useEventListener from '@jwdinker/use-event-listener';
import useTimeout from '@jwdinker/use-timeout';
import useSSR from '@jwdinker/use-ssr';
import getWindowRectangle, { WindowRectangle } from '@jwdinker/get-window-rectangle';

export { WindowRectangle } from '@jwdinker/get-window-rectangle';

export type WindowSizeReturn = [WindowRectangle, boolean];

/**
 * @param endDelay The duration of time waited between window resize events before the end is set to end.
 */
function useWindowSize(endDelay = 200): WindowSizeReturn {
  const { isBrowser } = useSSR();

  const [state, setState] = useState(() => {
    return [
      {
        height: 0,
        width: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      false,
    ];
  });

  const end = useCallback(() => {
    setState((previous) => {
      return [previous[0], true];
    });
  }, []);

  const [start, clear] = useTimeout(end, endDelay);

  const handler = useCallback(() => {
    clear();
    start();
    setState(() => [getWindowRectangle(), false]);
  }, [clear, start]);

  useEffect(() => {
    if (isBrowser) {
      setState(() => [getWindowRectangle(), false]);
    }
  }, [isBrowser]);

  /*
  Using 'resized' is safer than using a continuous resizing:true because using
  this boolean in a useEffect to trigger other calls to setState will result in
  a maximum call stack size exceeded error.  For that reason, setResized is set
  back to false when it is a true for ease of use. 
  */

  const resized = state[1];
  useEffect(() => {
    if (resized) {
      setState((previous) => [previous[0], false]);
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

  return state as WindowSizeReturn;
}

export default useWindowSize;
