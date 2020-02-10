import { useRef, useCallback, useEffect } from 'react';

function useAnimationFrame({
  onStart = () => {},
  onFrame = () => {},
  onCancel = () => {},
  delay = 0,
  toggable = false,
} = {}) {
  const raf = useRef();
  const callbacks = useRef({});
  const startTime = useRef();

  useEffect(() => {
    callbacks.current = {
      onStart,
      onFrame,
      onCancel,
    };
    return () => {
      callbacks.current = {
        onStart: null,
        onFrame: null,
        onCancel: null,
      };
    };
  }, [onCancel, onFrame, onStart]);

  const start = useCallback(() => {
    raf.current = null;
    if (callbacks.current) {
      const currentTime = Date.now();
      startTime.current = !startTime.current ? currentTime : startTime.current;

      const deltaTime = currentTime - startTime.current;

      if (deltaTime > delay) {
        callbacks.current.onFrame({ time: { current: currentTime, delta: deltaTime } });
        startTime.current = currentTime;
      }
      raf.current = requestAnimationFrame(start);
    }
  }, [delay]);

  const stop = useCallback(() => {
    if (raf.current) {
      cancelAnimationFrame(raf.current);
    }

    if (callbacks.current.onCancel && toggable) {
      callbacks.current.onCancel();
    }
  }, [toggable]);

  useEffect(() => {
    if (!toggable) {
      start();
      return stop;
    }
  }, [start, stop, toggable]);

  return [start, stop];
}

export default useAnimationFrame;
