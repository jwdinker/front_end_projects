export type UpdateByType = 'minute' | 'second' | 'millisecond';

export interface UseClockProps {
  interval?: number;
  updateBy?: UpdateByType;
}

export type TimePeriod = 'am' | 'pm';

export interface UseClockReturn {
  date: Date;
  seconds: number;
  minutes: number;
  military: number;
  hour: number;
  year: number;
  month: number;
  day: number;
  dayOfWeek: number;
  milliseconds: number;
  period: TimePeriod;
}
