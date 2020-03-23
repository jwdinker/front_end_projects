import { useEffect, useRef, useCallback, useMemo } from 'react';
import { UseTimeoutCallback, UseTimeoutReturn } from './types';

/**
 *
 * @param callback The callback that will be executed at the end of the timeout.
 * @param milliseconds The wait duration before the callback is executed.
 */
function useTimeout(
  callback: UseTimeoutCallback = (): void => {},
  milliseconds = 0
): UseTimeoutReturn {
  const timeout = useRef<number>();
  const saved = useRef<UseTimeoutCallback | undefined>();

  useEffect(() => {
    saved.current = callback;
  }, [callback]);

  const clear = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  }, []);

  const start = useCallback(() => {
    timeout.current = window.setTimeout(() => {
      if (saved.current) {
        saved.current();
      }
      clear();
    }, milliseconds);
  }, [clear, milliseconds]);

  useEffect(() => {
    return clear;
  }, [clear]);

  const value = useMemo((): UseTimeoutReturn => {
    return [start, clear];
  }, [clear, start]);

  return value;
}

export default useTimeout;
