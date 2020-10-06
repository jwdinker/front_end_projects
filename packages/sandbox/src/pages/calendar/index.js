import React, { useCallback, useState, useEffect, useRef, useMemo, Fragment, memo } from 'react';
import { Box, Column, Row, Flex, Text, Button, Absolute, Centered } from '@jwdinker/styled-system';
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
} from '@jwdinker/use-schedule';

import useTimeout from '@jwdinker/use-timeout';
import useEventListener from '@jwdinker/use-event-listener';
import { useSpring, animated, config } from 'react-spring';

import upTo from '@jwdinker/up-to';

import { startOfToday, add as addToDate, sub as subtract, subMonths, format } from 'date-fns';

import { withCoreProviders } from '../../hocs';

const MY_EVENTS = [
  {
    id: '8892c7b6-335d-4877-9b2f-c77c5915054f',
    start: '2020-05-29T23:00:00.000Z',
    end: '2020-05-30T00:00:00.000Z',
  },
  {
    id: 'ce33ff47-cf0c-4441-8148-e6716d42bec1',
    start: '2020-06-13T13:24:00.000Z',
    end: '2020-06-14T06:24:00.000Z',
  },
  {
    id: '5ae5861d-5720-4d13-ba5c-6840209e7667',
    start: '2020-06-17T18:11:00.000Z',
    end: '2020-06-18T07:11:00.000Z',
  },
  {
    id: '5194c6e7-87f6-47a0-9adb-95899b5a65b2',
    start: '2020-06-18T07:08:00.000Z',
    end: '2020-06-19T06:08:00.000Z',
  },
  {
    id: '39121da3-2105-4659-a95a-e7514027d9a0',
    start: '2020-07-05T22:55:00.000Z',
    end: '2020-07-05T23:55:00.000Z',
  },
  {
    id: '0e3eaede-e923-47b3-ba32-9a28df9839b4',
    start: '2020-07-12T22:31:00.000Z',
    end: '2020-07-13T20:31:00.000Z',
  },
  {
    id: 'a2a4fea7-3c17-42cf-a58a-93a7e4966e57',
    start: '2020-07-23T15:45:00.000Z',
    end: '2020-07-24T14:45:00.000Z',
  },
  {
    id: '4b905fdd-6c8a-4f0f-bc88-d83f3034f1ff',
    start: '2020-08-12T16:00:00.000Z',
    end: '2020-08-13T16:00:00.000Z',
  },
  {
    id: '1801af5e-2937-4bf2-8292-df3e954181f4',
    start: '2020-08-21T22:50:00.000Z',
    end: '2020-08-22T06:50:00.000Z',
  },
  {
    id: 'dc2f0a23-6f6f-4e44-9944-3da7fb108b87',
    start: '2020-08-23T05:45:00.000Z',
    end: '2020-08-23T13:45:00.000Z',
  },
  {
    id: '3ee9789d-cff6-4630-808c-00f6fec426fc',
    start: '2020-08-28T16:52:00.000Z',
    end: '2020-08-29T08:52:00.000Z',
  },
  {
    id: '55adb226-a4a4-4fb9-9723-10b1eea0928f',
    start: '2020-09-05T03:50:00.000Z',
    end: '2020-09-06T02:50:00.000Z',
  },
  {
    id: '7693d610-08bc-4d0d-b61b-4bebbaee9524',
    start: '2020-09-10T21:51:00.000Z',
    end: '2020-09-11T14:51:00.000Z',
  },
  {
    id: '486f1691-b0cf-4e95-bede-251214bbdf38',
    start: '2020-09-14T02:44:00.000Z',
    end: '2020-09-14T09:44:00.000Z',
  },
  {
    id: '1cb9bbb0-becd-4752-b009-efb954f51405',
    start: '2020-09-24T21:28:00.000Z',
    end: '2020-09-25T03:28:00.000Z',
  },
  {
    id: 'f30f9625-aef6-48b1-9793-8d2b432aa0c9',
    start: '2020-10-03T23:53:00.000Z',
    end: '2020-10-04T17:53:00.000Z',
  },
  {
    id: '5aa9127f-084a-4f93-9540-3c2b6010b187',
    start: '2020-10-08T15:00:00.000Z',
    end: '2020-10-09T00:00:00.000Z',
  },
  {
    id: '943d126b-0455-45ba-ae4b-5cb8c01d3cda',
    start: '2020-10-10T17:42:00.000Z',
    end: '2020-10-11T03:42:00.000Z',
  },
  {
    id: '7d52811a-b51e-4160-a188-0ac55b13aaa0',
    start: '2020-10-14T09:27:00.000Z',
    end: '2020-10-15T00:27:00.000Z',
  },
  {
    id: 'ff8b1c17-45c8-402d-87f4-6da84ff8e688',
    start: '2020-10-17T05:34:00.000Z',
    end: '2020-10-17T14:34:00.000Z',
  },
  {
    id: 'f0e22638-22fe-475d-858f-a63d2a239b65',
    start: '2020-11-22T05:34:00.000Z',
    end: '2020-11-22T08:34:00.000Z',
  },
];

const TEST_TIMES = MY_EVENTS.map((event) => {
  return {
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  };
});

const { log, info } = console;

const logger = (text = '', code = '', stringify = false) => {
  log('\n\n\n\n\n');

  log(
    `%c ${text}: \n ------------------------------------------------- \n`,
    'background:#ffe43a;color:#5A440D;font-weight:bold;'
  );
  if (stringify) {
    log(JSON.stringify(code, null, 2));
  } else {
    log(code);
  }
  log(
    `%c\n ------------------------------------------------- \n`,
    'background:#ffe43a;color:#5A440D;font-weight:bold;'
  );
  log('\n\n\n\n\n');
};

function Event({ event, styles }) {
  const [spreadables, props, reference, preview] = useDragEvent(event);

  return useMemo(() => {
    return styles.map((style, index) => {
      const date = index === 0 ? event.start : event.end;
      const ref = index === 0 ? reference : undefined;
      const _preview = index === 0 ? preview : undefined;
      return (
        <Fragment key={index}>
          <Absolute
            // {...spreadables}
            ref={ref}
            id={event.id}
            border="1px solid"
            style={{
              ...style,
              visibility: props.isDragging ? 'hidden' : 'visible',
              fontSize: '10px',
            }}
            bg="blue.5"
            zIndex={0}>
            {format(date, 'MMM d y hh:mm aaaa')}
          </Absolute>
          {props.isDragging ? (
            <Absolute
              id={event.id}
              {...spreadables}
              border="dotted 3px"
              borderColor="red.9"
              zIndex={-1}
              ref={_preview}
              style={{ ...props.style, ...style, opacity: 0.5, fontSize: '10px' }}
              bg="blue.5">
              {format(date, 'MMM d y hh:mm aaaa')}
            </Absolute>
          ) : null}
        </Fragment>
      );
    });
  }, [
    event.end,
    event.id,
    event.start,
    preview,
    props.isDragging,
    props.style,
    reference,
    spreadables,
    styles,
  ]);
}

const areEventStylesEqual = (previous, current) => previous.styles === current.styles;

const EventMemoized = memo(Event, areEventStylesEqual);

// const dummyDates = upTo(1, 11, (index) => {
//   if (index === 7) {
//     const start = addToDate(TODAY, { days: 6, hours: 12 });
//     const end = addToDate(start, { days: 1 });
//     return { start, end };
//   }
//   const start = addToDate(TODAY, { days: index });
//   const end = addToDate(start, { hours: index * 2 });
//   return { start, end };
// });

// const dummyDates = upTo(0, 0, (index) => {
//   const start = addToDate(TODAY, { days: 6, hours: 12 });
//   const end = addToDate(start, { days: 1 });
//   return { start, end };
// });

// const start = addToDate(TODAY, { days: 5, hours: 12 });
// const end = addToDate(start, { days: 2 });

// const dummyDates = [{ start, end }];

// const start = addToDate(TODAY, { hours: 12 });
// const end = addToDate(start, { hours: 1 });

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomMinutes() {
  return randomIntFromInterval(0, 60);
}
function getRandomDays() {
  return randomIntFromInterval(0, 90);
}

function getRandomHours() {
  return randomIntFromInterval(1, 24);
}

const TODAY = startOfToday();

function DaysOfWeekForMonthLayout() {
  const namesOfDays = useNamesOfDays('EEE');
  return (
    <Flex
      py={1}
      position="relative"
      zIndex={1}
      bg="#202122"
      width="100%"
      justifyContent="center"
      borderBottom="1px solid"
      borderColor="#3b3d3e">
      <Row justifyContent="space-evenly">
        {namesOfDays.map((name) => {
          return (
            <Flex pr="3px" key={name} flexDirection="row-reverse" flex={1}>
              <Text fontSize="14px" fontWeight="medium" color="white">
                {name.toUpperCase()}
              </Text>
            </Flex>
          );
        })}
      </Row>
    </Flex>
  );
}

// const TEST_TIMES = upTo(-10, 10, (index) => {
//   if (index < 0) {
//     const start = subtract(TODAY, {
//       days: getRandomDays(),
//       hours: getRandomHours(),
//       minutes: getRandomMinutes(),
//     });
//     const end = addToDate(start, { hours: getRandomHours() });
//     return { start, end };
//   }

//   const start = addToDate(TODAY, {
//     days: getRandomDays(),
//     hours: getRandomHours(),
//     minutes: getRandomMinutes(),
//   });
//   const end = addToDate(start, { hours: getRandomHours() });
//   return { start, end };
// });

const DayOfGrid = ({
  date,
  i,
  style,
  start,
  end,
  borderBottom,
  borderTop,
  borderRight,
  isSelected,
}) => {
  const isWeekend = (i + 1) % 7 === 0 || i % 7 === 0;
  const background = isSelected ? 'green' : isWeekend ? '#2b2c2d' : '#202122';

  // const borderTop = i >= start.index && i <= 6 ? '2px solid #606060' : 'none';

  // const borderBottom = i < start.index ? '2px solid #606060' : '1px solid #444647';

  // const borderRight = i === start.index - 1 ? '2px solid #606060' : '1px solid #444647';

  // const borderBottom = '1px solid #444647';

  return (
    <div
      style={{
        ...style,
        borderTop,
        borderBottom,
        borderRight,
        background,
      }}>
      <div style={{ color: 'white' }}>{date.getDate()}</div>
      {/* <Text color="white"> {format(date, 'MMM d y')}</Text> */}
    </div>
  );
};

const DayOfGridMemoized = memo(
  DayOfGrid,
  (previous, current) => previous.isSelected === current.isSelected
);

const WeekOfGrid = (props) => {
  const { dates, styles, key, offset } = props;

  const hasOffset = offset > -1;

  return useMemo(
    () => (
      <>
        <div key={key} style={styles.week}>
          {dates.map((date, i) => {
            const bbWidth = hasOffset && i < offset ? 3 : 1;
            const btWidth = hasOffset && i > offset ? 3 : 1;
            const borderBottom = `${bbWidth}px solid #444647`;
            const borderTop = hasOffset && i >= offset ? `3px solid #444647` : 'none';

            const borderRight =
              hasOffset && i === offset - 1 ? '3px solid #444647' : '1px solid #444647';
            return (
              <DayOfGrid
                isSelected={false}
                range={dates}
                style={styles.day}
                key={i}
                date={date}
                i={i}
                borderTop={borderTop}
                borderBottom={borderBottom}
                borderRight={borderRight}
              />
            );
          })}
        </div>
      </>
    ),
    [dates, hasOffset, key, offset, styles.day, styles.week]
  );
};

const WeekOfGridMemoized = memo(WeekOfGrid, areDatesOfVirtualGridEqual);

// const SVGEvent = (event) => {
//   const DAY_WIDTH = 1 / 7;
//   const MINUTES_IN_DAY = 1440;
//   const GRID_HEIGHT_IN_MINUTES = MINUTES_IN_DAY * 18;
//   const HEIGHT_PER_ROW = 100 / 18;

//   const [spreadables, props, reference, preview] = useDragEvent(event);

//   const width = DAY_WIDTH * 2 * 100;
//   return (
//     <svg
//       width={`${DAY_WIDTH * 2 * 100}%`}
//       height={`${HEIGHT_PER_ROW}%`}
//       viewBox="0 0 100 100"
//       preserveAspectRatio="none"
//       // viewBox={`0 0 ${DAY_WIDTH * 3 * 100}% 14.2857%`}
//       version="1.1"
//       xmlns="http://www.w3.org/2000/svg"
//       style={{
//         zIndex: 1,
//         position: 'absolute',
//         overflow: 'visible',
//         top: '12.88888888888889%',
//         left: '42.857142857142854%',
//         pointerEvents: 'none',
//       }}>
//       <g
//         ref={reference}
//         id="flag"
//         {...spreadables}
//         style={{ ...props.style, pointerEvents: 'all' }}>
//         <rect fill="purple" x="0%" y="50%" width="50%" height="50%" />

//         <rect fill="purple" x="50%" y="0%" width="50%" height="50%" />

//         {/* <polygon fill="yellow" points="0,50 0,100 50,100 50,50 100,50 100,0 50,0 50,50" /> */}
//       </g>
//     </svg>
//   );
// };

const SVGEvent = (event) => {
  const DAY_WIDTH = 1 / 7;
  const MINUTES_IN_DAY = 1440;
  const GRID_HEIGHT_IN_MINUTES = MINUTES_IN_DAY * 18;
  const HEIGHT_PER_ROW = 100 / 18;

  const [spreadables, props, reference, preview] = useDragEvent(event);

  const style = {
    position: 'absolute',
    overflow: 'visible',
    top: '12.88888888888889%',
    left: '42.857142857142854%',
    pointerEvents: 'none',
    width: `${DAY_WIDTH * 2 * 100}%`,
    height: `${HEIGHT_PER_ROW}%`,
    maxWidth: '100%',
  };

  return (
    <div style={style}>
      <div style={{ position: 'relative', height: '100%', width: '100%' }}>
        <svg
          width="100%"
          // height="100%"
          // viewBox={`0 0 ${DAY_WIDTH} ${18}`}
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 100 100"
          version="1.1"
          style={{ overflow: 'visible', maxWidth: '100%' }}
          xmlns="http://www.w3.org/2000/svg">
          <g
            ref={reference}
            id="flag"
            {...spreadables}
            style={{ ...props.style, pointerEvents: 'all' }}>
            <polygon fill="yellow" points="0,50 0,100 50,100 50,50 100,50 100,0 50,0 50,50" />
            {/* <rect fill="purple" x="0%" y="50%" width="50%" height="50%" />

        <rect fill="purple" x="50%" y="0%" width="50%" height="50%" /> */}
          </g>
        </svg>
      </div>
    </div>
  );
};

const OTHER_STYLE = {
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: '100%',
};
const OtherContainer = () => {
  return <div style={OTHER_STYLE} />;
};

const DAY_WIDTH = 100 / 7;

function MonthHeader() {
  const viewing = useViewingDate();

  const [nameOfMonth, year] = useMemo(() => {
    return format(viewing.date, 'MMMM RRRR').split(' ');
  }, [viewing.date]);

  return useMemo(() => {
    return (
      <Row flex={10} px={`${DAY_WIDTH - DAY_WIDTH / 2}%`} alignItems="center">
        <Text fontSize="32px" fontWeight="medium" color="white">
          {nameOfMonth}
        </Text>
        <Text fontSize="32px" fontWeight="thin" color="#e62322">
          {year}
        </Text>
      </Row>
    );
  }, [nameOfMonth, year]);
}

const springConfig = {
  mass: 1,
  tension: 300,
  friction: 10,
};
function MonthLayout() {
  const controller = useRef();
  const viewing = useViewingDate();
  const [selected, { select, getPlacement, isSelected }] = useDateSelect();
  const [events, { filterByDate, create, add, clear }] = useEvents();

  const data = useCallback(
    ({ dates }) => {
      return {
        isSelected,
        events: filterByDate(dates[0], dates[dates.length - 1]),
      };
    },
    [filterByDate, isSelected]
  );

  const { visible, container, translator, timeframe, transform } = useVirtualGridOfMonths({
    data,
    events,
    initialDate: viewing.date,
    component: WeekOfGridMemoized,

    onChange: (date) => {
      viewing.set(date);
    },
    onClick: (date) => {
      // select.multiple(date);
      console.log('%cCLICKED DATE', 'background:yellow;color:black;', date);
    },
  });

  const [animation, set] = useSpring(() => {
    return {
      ...translator.style,
      transform,
      config: config.smooth,
    };
  });

  // useEffect(() => {
  //   set(() => {
  //     return {
  //       ...translator.style,
  //       transform,
  //     };
  //   });
  // }, [set, transform, translator.style]);
  // const [startRemove] = useTimeout(() => {
  //   clear();
  // }, 10000);

  // const [startAdd] = useTimeout(() => {
  //   add(TEST_TIMES);
  // }, 15000);

  useEffect(() => {
    add(TEST_TIMES);
  }, [add, create]);

  const styles = useEventStyles(events, visible);

  return useMemo(
    () => (
      <>
        <div {...container}>
          <div {...translator}>
            {timeframe}

            {/* {events.map((event, index) => {
              return <EventMemoized key={event.id} event={event} styles={styles[index]} />;
            })} */}
          </div>
        </div>
      </>
    ),
    [container, timeframe, translator]
  );
}

const DAY_OF_WEEK_STYLE = {
  flex: 5,
  fontSize: '16px',
  fontWeight: '500',
  color: 'white',
  borderBottom: '1px solid #3b3d3e',
  background: '#202122',
  padding: '10px 0 10px 0',
};

function Index() {
  const [layout, { toMonth }] = useLayoutToggler();
  const viewing = useViewingDate();

  const Layout = layout === 'month' ? MonthLayout : null;

  // useEffect(() => {
  //   document.body.style.overflow = 'hidden';
  // }, []);
  return (
    <Box width={1} height="100vh">
      <Flex width={1} height="100%">
        <Column bg="#202122" height="100%" id="calendar_contents">
          <MonthHeader />
          <DaysOfWeekHeader style={DAY_OF_WEEK_STYLE} align="center" />
          <Flex flex={80}>
            <Layout />
          </Flex>
        </Column>
      </Flex>
    </Box>
  );
}

export default withCoreProviders(Index);
