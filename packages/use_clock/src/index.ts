import useAnimationFrame from '@jwdinker/use-animation-frame';
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { UseClockProps, UseClockReturn } from './types';
import { makeCanUpdateTime } from './helpers';

const PROPERTIES = {
  seconds: 'getSeconds',
  minutes: 'getMinutes',
  hour: 'getHours',
  year: 'getFullYear',
  month: 'getMonth',
  day: 'getDate',
  dayOfWeek: 'getDay',
  milliSeconds: 'getMilliseconds',
};

const PROPERTY_KEYS = Object.keys(PROPERTIES);

function useClock({ updateBy = 'minute', interval = 100 }: UseClockProps = {}): UseClockReturn {
  const [time, setTime] = useState(() => new Date());

  const canUpdateTime = useMemo(() => {
    return makeCanUpdateTime(updateBy);
  }, [updateBy]);

  const savedTime = useRef(time);
  savedTime.current = time;

  const handler = useCallback(() => {
    const currentTime = new Date();
    if (canUpdateTime(savedTime.current, currentTime)) {
      setTime(currentTime);
    }
  }, [canUpdateTime]);
  const [start, clear] = useAnimationFrame(handler, interval);

  useEffect(() => {
    start();
    return clear;
  }, [clear, start]);

  return PROPERTY_KEYS.reduce((accumulator, key, index) => {
    const method = PROPERTIES[key];

    accumulator[key] = time[method]();
    if (index === 0) {
      accumulator.date = time;
    }
    return accumulator;
  }, {} as UseClockReturn);
}

export default useClock;
