# useClock

`useClock` is a react hook that tracks the changing time at a specified interval and supplies the requested properties for building a clock interface.

<br><br><br><br><br><br>

# Table of Contents

- [Installation](#Installation)
- [Usage](#Usage)
  <br>
- [Arguments](#Arguments)

  1. [`format`](#1.-format)

  2. [`compareBy`](#2.-compareBy)

  3. [`interval`](#3.-interval)

- [Helpers](#Helpers)

  - [`to00`](#to00)

  - [`get12Hour`](#get12Hour)

  - [`timeOfDay`](#timeOfDay)

  - [`nameOfDay`](#nameOfDay)

<br><br><br><br><br><br>

# Installation

```
npm install @jwdinker/use-clock
```

<br><br><br><br><br><br>

# Usage

```jsx
import useClock, { to00, get12Hour, timeOfDay, nameOfDay } from '@jwdinker/use-clock';

function Component() {
  const time = useClock((date) => {
    return {
      seconds: to00(date.getSeconds()),
      hour: get12Hour(date),
      minutes: to00(date.getMinutes()),
      day: date.getDate(),
      dayOfWeek: nameOfDay(date, 'ddd'),
      period: timeOfDay(date),
    };
  }, 'second');

  const { hour, minutes, seconds, period, dayOfWeek } = time;

  return `${dayOfWeek} ${hour}:${minutes}:${seconds} ${period}`;
}
```

<br><br><br><br><br><br>

# Arguments

useClock accepts 3 arguments.

<br>

## 1. `format`

_required_

```ts
format = (date: Date) => T;
```

The format function allows you to format the return value in whatever way you see fit. See the [Helpers](#Helpers) section for some functions that will cover most use cases outside the standard date object methods.

<br><br><br>

## 2. `updateBy`

```ts
compareBy: 'second' | 'minute' | 'millisecond';
```

Dictates how the time comparison will be made, consequently, updating the time state and causing a re-render.

<br><br><br>

## 3. `interval`

```ts
interval: number = 100;
```

The interval rate at which the time is comparison is made.

<br><br><br><br><br><br>

# Helpers

## `to00`

```ts
to00 = (value: number) => string;
```

Adds an extra `0` to any single digit < 10. For example, a argument value of `1` would return `'01'`

<br><br><br>

## `get12Hour`

```ts
get12Hour = (date: Date) => number;
```

Converts the default military hour to a 12 hour format.

<br><br><br>

## `timeOfDay`

```ts
timeOfDay = (date: Date) => 'am' | 'pm';
```

Returns the time period of the day as either `am` or `pm`.

<br><br><br>

## `nameOfDay`

```ts
nameOfDay = (date: Date, dayFormat = 'dd' | 'ddd' | 'dddd') => string;
```

Returns the name of the current day. The day format:

- `dd` - abbreviated to the first 2 characters of the day.
- `ddd` - abbreviated to the first 3 characters of the day.
- `dddd` - Uses the full day name.

<br><br><br>
