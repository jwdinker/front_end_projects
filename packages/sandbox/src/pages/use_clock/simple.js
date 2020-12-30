import React from 'react';
import useClock, { to00, get12Hour, timeOfDay, nameOfDay } from '@jwdinker/use-clock';

import { withCoreProviders } from '../../hocs';

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

export default withCoreProviders(Component);
