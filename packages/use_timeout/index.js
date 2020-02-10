import { useEffect, useRef, useCallback } from 'react';

function useTimeout(callback = () => {}, milliseconds = 0) {
  const timeout = useRef();
  const saved = useRef();

  useEffect(() => {
    saved.current = {
      callback: callback,
    };
  }, [callback]);

  const clear = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  }, []);

  const start = useCallback(() => {
    timeout.current = setTimeout(() => {
      saved.current.callback();
      clear();
    }, milliseconds);
  }, [clear, milliseconds]);

  return [start, clear];
}

export default useTimeout;
