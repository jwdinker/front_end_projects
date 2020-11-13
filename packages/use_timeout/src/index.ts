import { useEffect, useRef, useCallback } from 'react';
import { UseTimeoutCallback, UseTimeoutReturn, onTimeout } from './types';

const hasRequestAnimationFrame =
  typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function';

const getTimer = (fn: onTimeout, milliseconds: number) => {
  if (hasRequestAnimationFrame) {
    return window.requestAnimationFrame(fn);
  }
  return setTimeout(fn, milliseconds);
};

/**
 *
 * @param callback The callback that will be executed at the end of the timeout.
 * @param milliseconds The wait duration before the callback is executed.
 */
function useTimeout(callback: UseTimeoutCallback, milliseconds = 0): UseTimeoutReturn {
  const timer = useRef<number>();
  const _callback = useRef<UseTimeoutCallback | undefined>();
  const startTime = useRef(0);

  useEffect(() => {
    _callback.current = callback;
  }, [callback]);

  const clear = useCallback(() => {
    if (timer.current) {
      if (hasRequestAnimationFrame) {
        startTime.current = 0;
        window.cancelAnimationFrame(timer.current);
      } else {
        clearTimeout(timer.current);
      }
      timer.current = undefined;
    }
  }, []);

  const onExpiration = useCallback(() => {
    if (_callback.current) {
      if (hasRequestAnimationFrame) {
        const time = Date.now();
        const duration = time - startTime.current;
        const isWaitThresholdMet = duration >= milliseconds;

        if (isWaitThresholdMet) {
          _callback.current();
          clear();
        } else {
          timer.current = getTimer(onExpiration, milliseconds);
        }
      } else {
        _callback.current();
        clear();
      }
    }
  }, [milliseconds, clear]);

  const start = useCallback(() => {
    startTime.current = Date.now();
    timer.current = getTimer(onExpiration, milliseconds);
  }, [milliseconds, onExpiration]);

  useEffect(() => {
    return clear;
  }, [clear]);

  return [start, clear];
}

export default useTimeout;
