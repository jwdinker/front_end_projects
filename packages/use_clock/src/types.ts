export type CompareBy = 'minute' | 'second' | 'millisecond';

export type FormatTime<T> = (date: Date) => T;

export type TimePeriod = 'am' | 'pm';

export type NameOfDayFormat = 'dd' | 'ddd' | 'dddd';
