import { useRef, useCallback, useEffect } from 'react';
import { UseIntervalReturn, OnWait, OnInterval, UseIntervalProps } from './types';

export * from './types';

/**
 *
 * @param options
 * @param options.interval The interval at which each onInterval callback is executed.
 * @param options.onInterval A callback executed after the end of an interval.
 * @param options.onWait A callback executed on each frame prior to the completion of the interval.
 */
function useInterval(options: UseIntervalProps): UseIntervalReturn {
  const { interval = 0, onWait = () => {}, onInterval = () => {} } = options;

  const raf = useRef<number | null>(null);
  const _onWait = useRef<OnWait | null>();
  const _onInterval = useRef<OnInterval | null>();
  const startTime = useRef<number>(0);
  const hasForcedStop = useRef(false);

  useEffect(() => {
    _onWait.current = onWait;
    _onInterval.current = onInterval;
    return () => {
      _onWait.current = null;
      _onInterval.current = null;
    };
  }, [onInterval, onWait]);

  const end = useCallback(() => {
    if (raf.current) {
      window.cancelAnimationFrame(raf.current);
    }
    startTime.current = 0;
    hasForcedStop.current = false;
  }, []);

  const stop = useCallback(() => {
    hasForcedStop.current = true;
  }, []);

  const start = useCallback(() => {
    raf.current = null;

    const currentTime = Date.now();
    startTime.current = startTime.current === 0 ? currentTime : startTime.current;

    const elapsedTime = currentTime - startTime.current;

    if (elapsedTime > interval) {
      startTime.current = currentTime;
      if (_onInterval.current) {
        _onInterval.current(currentTime, stop);
      }
    } else if (_onWait.current) {
      _onWait.current(elapsedTime, currentTime, stop);
    }

    if (!hasForcedStop.current) {
      raf.current = window.requestAnimationFrame(start);
    } else {
      end();
    }
  }, [end, interval, stop]);

  return [start, end];
}

export default useInterval;
