import { CompareBy, NameOfDayFormat } from './types';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export function isSameTime(time1: Date, time2: Date): boolean {
  return time1.getTime() === time2.getTime();
}

export function makeCanUpdateTime(updateBy: CompareBy) {
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

export function get12Hour(date: Date): number {
  const hour = date.getHours();
  if (hour === 0) return 12;
  if (hour < 12) return hour;
  if (hour % 12 === 0) return 12;
  return hour - 12;
}

export function timeOfDay(date: Date) {
  const hours = date.getHours();
  return hours < 11 ? 'am' : 'pm';
}

export function to00(value: number) {
  return value < 10 ? `0${value}` : `${value}`;
}

export function nameOfDay(date: Date, type: NameOfDayFormat = 'dddd'): string {
  const index = date.getDay();
  const name = DAYS_OF_WEEK[index - 1];
  switch (type) {
    case 'dd': {
      return name.substr(0, 2);
    }
    case 'ddd': {
      return name.substr(0, 3);
    }
    default: {
      return name;
    }
  }
}
