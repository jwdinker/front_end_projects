import { useRef, useCallback, useEffect } from 'react';
import { UseAnimationFrameReturn, OnFrame } from './types';

export * from './types';

/**
 *
 * @param onFrame A callback executed on every animation frame while the loop is executed.
 * @param interval The interval at which each callback is executed.
 */
function useAnimationFrame(onFrame: OnFrame, interval = 0): UseAnimationFrameReturn {
  const raf = useRef<number | null>(null);
  const callback = useRef<Function>(onFrame);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    callback.current = onFrame;
  }, [onFrame]);

  const start = useCallback(() => {
    raf.current = null;
    if (callback.current) {
      const currentTime = Date.now();
      startTime.current = !startTime.current ? currentTime : startTime.current;

      const elapsedTime = currentTime - startTime.current;

      if (elapsedTime > interval && callback.current) {
        callback.current(currentTime, elapsedTime);
        startTime.current = currentTime;
      }
      raf.current = requestAnimationFrame(start);
    }
  }, [interval]);

  const stop = useCallback(() => {
    if (raf.current) {
      startTime.current = 0;
      cancelAnimationFrame(raf.current);
    }
  }, []);

  return [start, stop];
}

export default useAnimationFrame;
