import useAnimationFrame from '@jwdinker/use-animation-frame';
import { useState, useEffect, useMemo, useRef } from 'react';
import { FormatTime, CompareBy } from './types';
import { makeCanUpdateTime } from './helpers';

export { get12Hour, timeOfDay, to00, nameOfDay } from './helpers';

function useClock<T>(format: FormatTime<T>, compareBy: CompareBy, interval = 100): T {
  const [time, setTime] = useState(() => new Date());

  const canUpdateTime = useMemo(() => {
    return makeCanUpdateTime(compareBy);
  }, [compareBy]);

  const savedTime = useRef(time);
  savedTime.current = time;

  const [start, clear] = useAnimationFrame(() => {
    const currentTime = new Date();
    if (canUpdateTime(savedTime.current, currentTime)) {
      setTime(currentTime);
    }
  }, interval);

  useEffect(() => {
    start();
    return clear;
  }, [clear, start]);

  return format(time);
}

export default useClock;
