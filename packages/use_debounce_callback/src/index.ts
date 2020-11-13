import * as React from 'react';
import useTimeout from '@jwdinker/use-timeout';

const { useCallback, useEffect, useRef } = React;

/*
    The useDebounceCallback hook has 2 different strategies. A timeout is used
    in both.

    1. In the first scenario, the immediate prop is true.
      - The arguments passed to the function are stored for future use in the
        callback.
      - The callback is invoked right away.
      - canInvoke is set to false in order to block any future function calls
        that happen during the wait period.
      - If at anytime the debounce function is called during the wait period,
        the timeout is cleared and starts all over.
      - Once the wait period is over, canInvoke is set to true to allow future
        immediate function invocations.

    2. In the second scenario, the immediate prop is false.
      - The arguments passed to the function are stored for future use in the
        callback.
      - a single timeout begins destined to invoke the callback function.
      - If at anytime the debounce function is called during the wait period,
        the timeout is cleared and a new timeout begins.
      - When the wait period is over the callback is invoked with the saved
        arguments.
   */

function useDebounceCallback<T extends (...args: any[]) => ReturnType<T>>(
  callback: T,
  wait = 100,
  immediate = false
) {
  const _callback = useRef(callback);
  const _arguments = useRef<any[]>();
  const canInvoke = useRef(immediate);

  useEffect(() => {
    _callback.current = callback;
  }, [callback]);

  const invoke = useCallback(() => {
    const args = _arguments.current;
    if (args) {
      if (Array.isArray(args)) {
        _callback.current(...args);
      } else {
        _callback.current(args);
      }
    }
    _arguments.current = undefined;
  }, []);

  const [start, clear] = useTimeout(() => {
    if (immediate) {
      canInvoke.current = true;
    } else {
      invoke();
    }
  }, wait);

  const debounce = useCallback(
    (...args) => {
      const isWaiting = !immediate || (immediate && !canInvoke.current);
      _arguments.current = args;

      if (!isWaiting) {
        invoke();
        canInvoke.current = false;
      } else {
        clear();
        start();
      }
    },
    [clear, immediate, invoke, start]
  );

  return debounce;
}

export default useDebounceCallback;
