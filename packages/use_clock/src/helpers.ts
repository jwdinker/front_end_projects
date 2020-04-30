import { UpdateByType } from './types';

export function isSameTime(time1: Date, time2: Date): boolean {
  return time1.getTime() === time2.getTime();
}

export function makeCanUpdateTime(updateBy: UpdateByType) {
  return (date1: Date, date2: Date): boolean => {
    if (updateBy === 'millisecond') {
      return !isSameTime(date1, date2);
    }

    const previousTime = new Date(date1.getTime());
    const currentTime = new Date(date2.getTime());

    previousTime.setMilliseconds(0);
    currentTime.setMilliseconds(0);

    if (updateBy === 'minute') {
      previousTime.setSeconds(0);
      currentTime.setSeconds(0);
    }

    return !isSameTime(previousTime, currentTime);
  };
}
