import { useRef, useCallback, useEffect } from 'react';
import { UseAnimationFrameReturn } from './types';

/**
 *
 * @param onFrame A callback executed on every animation frame while the loop is executed.
 * @param interval The interval at which each callback is executed.
 */
function useAnimationFrame(onFrame = (): void => {}, interval = 0): UseAnimationFrameReturn {
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

      const deltaTime = currentTime - startTime.current;

      if (deltaTime > interval && callback.current) {
        callback.current(currentTime, deltaTime);
        startTime.current = currentTime;
      }
      raf.current = requestAnimationFrame(start);
    }
  }, [interval]);

  const stop = useCallback(() => {
    if (raf.current) {
      cancelAnimationFrame(raf.current);
    }
  }, []);

  return [start, stop];
}

export default useAnimationFrame;
