import { useRef, useCallback, useEffect } from 'react';

function useAnimationFrame({
  onStart = () => {},
  onFrame = () => {},
  onCancel = () => {},
  delay = 0,
  toggable = false,
} = {}) {
  const raf = useRef();
  const callbacks = useRef();
  const startTime = useRef();

  useEffect(() => {
    callbacks.current = {
      onStart,
      onFrame,
      onCancel,
    };
  }, [onCancel, onFrame, onStart]);

  const start = useCallback(() => {
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
    cancelAnimationFrame(raf.current);

    if (callbacks.current && toggable) {
      callbacks.current.onCancel();
    }
  }, [toggable]);

  useEffect(() => {
    if (!toggable) {
      start();
      return stop;
    }
  }, [start, stop, toggable]);

  useEffect(() => {
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return [start, stop];
}

export default useAnimationFrame;
