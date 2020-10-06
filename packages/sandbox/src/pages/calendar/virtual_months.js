import React, { useCallback, useState, useEffect, useRef, useMemo, Fragment, memo } from 'react';
import {
  Box,
  Column,
  Row,
  Flex,
  Text,
  Button,
  Absolute,
  Centered,
  Relative,
} from '@jwdinker/styled-system';
import {
  useEvents,
  useDragEvent,
  useEventStyle,
  useViewingDate,
  useDateSelect,
  useLayoutToggler,
  useVirtualGridOfMonths,
  areDatesOfVirtualGridEqual,
  MonthOfGrid,
  useEventStyles,
  useNamesOfDays,
  DaysOfWeekHeader,
  useVirtualMonths,
  getBorders,
} from '@jwdinker/use-schedule';

import useTimeout from '@jwdinker/use-timeout';
import useEventListener from '@jwdinker/use-event-listener';
import { useSpring, animated, config } from 'react-spring';

import upTo from '@jwdinker/up-to';

import {
  startOfToday,
  add as addToDate,
  sub as subtract,
  subMonths,
  format,
  getDay,
} from 'date-fns';
import useAnimationFrame from '@jwdinker/use-animation-frame';
import { withCoreProviders } from '../../hocs';

const { log, info } = console;

const DAY_WIDTH = 100 / 7;

function MonthHeader() {
  const viewing = useViewingDate();

  const [nameOfMonth, year] = useMemo(() => {
    return format(viewing.date, 'MMMM RRRR').split(' ');
  }, [viewing.date]);

  return useMemo(() => {
    return (
      <Row flex={10} px={`${DAY_WIDTH - DAY_WIDTH / 2}%`} alignItems="center">
        <Text mr="10px" fontSize="32px" fontWeight="medium">
          {nameOfMonth}
        </Text>
        <Text fontSize="32px" fontWeight="thin" color="#e62322">
          {year}
        </Text>
      </Row>
    );
  }, [nameOfMonth, year]);
}

function DaysOfWeekForMonthLayout() {
  const namesOfDays = useNamesOfDays('EEE');
  return (
    <Flex
      flex={5}
      position="relative"
      zIndex={1}
      bg="#f8f8f8"
      width="100%"
      justifyContent="center"
      border="1px solid #ebebeb">
      <Row justifyContent="space-evenly">
        {namesOfDays.map((name) => {
          return (
            <Flex
              key={name}
              flexDirection="row-reverse"
              alignItems="center"
              justifyContent="center"
              flex={1}>
              <Text
                fontSize="16px"
                fontWeight="medium"
                color="#61666b"
                borderRight="1px solid #ebebeb">
                {name}
              </Text>
            </Flex>
          );
        })}
      </Row>
    </Flex>
  );
}

function Week({ dates, styles }) {
  return useMemo(
    () => (
      <div style={styles.week}>
        {dates.map((date, index) => {
          return (
            <div key={index} style={styles.day}>
              <div
                style={{
                  borderTop: '1px solid #e2e2e3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  width: '100%',
                }}>
                {date.getDate()}
              </div>
            </div>
          );
        })}
      </div>
    ),
    [dates, styles.day, styles.week]
  );
}

function Renderer(props) {
  if (props.type === 'week') {
    return <Week {...props} />;
  }

  const { startOfMonth, style } = props;
  const monthStartsOn = getDay(startOfMonth);

  return (
    <div style={style}>
      <div
        style={{
          position: 'absolute',

          left: `${(monthStartsOn / 7) * 100}%`,
          bottom: 0,
          fontWeight: 'bold',
          fontSize: '20px',
          color: '#ff3b30',
        }}>
        {format(startOfMonth, 'MMM')}
      </div>
    </div>
  );
}

// function Month({ dates, styles }) {
//   const lastIndex = dates.length - 1;
//   return useMemo(
//     () => (
//       <div style={styles.month}>
//         {dates.map((week, weekIndex) => {
//           let weekStyle = styles.weeks.remaining;
//           if (weekIndex === 0) {
//             weekStyle = styles.weeks.first;
//           }
//           if (weekIndex === lastIndex) {
//             weekStyle = styles.weeks.last;
//           }
//           return (
//             <div key={weekIndex} style={weekStyle}>
//               {week.map((date, dayIndex) => {
//                 return (
//                   <div key={dayIndex} style={styles.day}>
//                     <Centered height="100%" width={1} style={{ fontSize: '10px' }}>
//                       {date.getDate()}
//                       {/* {format(date, 'MMM d y')} */}
//                     </Centered>
//                   </div>
//                 );
//               })}
//             </div>
//           );
//         })}
//       </div>
//     ),
//     [
//       dates,
//       lastIndex,
//       styles.day,
//       styles.month,
//       styles.weeks.first,
//       styles.weeks.last,
//       styles.weeks.remaining,
//     ]
//   );
// }

function MonthLayout() {
  const container = useRef();
  const translator = useRef();
  // const viewing = useViewingDate();

  const [animation, set] = useSpring(() => {
    return {};
  });

  const { months, styles } = useVirtualMonths({
    container,
    component: Renderer,
    translator,
    sizePerWeek: 10,
    headerSize: 10,
    // onChange: viewing.set,

    animate: (style) => set(() => style),
  });

  // useEffect(() => {
  //   set(() => ({
  //     ...styles.translator,
  //     transform,
  //   }));
  // }, [set, styles.translator, transform]);

  return useMemo(
    () => (
      <div ref={container} style={styles.container}>
        <animated.div style={animation}>{months}</animated.div>
      </div>
    ),
    [animation, months, styles.container]
  );
}

function Index() {
  return (
    <Box width={1} height="100vh">
      <MonthLayout />
    </Box>
  );
}

export default withCoreProviders(Index);
