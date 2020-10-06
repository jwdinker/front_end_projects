import React, { useEffect, useRef } from 'react';
import useClock from '@jwdinker/use-clock';
import { Box, Centered, Ratio, Absolute, Text } from '@jwdinker/styled-system';
import upTo from '@jwdinker/up-to';
import { useSprings, animated } from 'react-spring';
import usePrevious from '@jwdinker/use-previous';

import styled from 'styled-components';
import { withCoreProviders } from '../../hocs';

const SECONDS_HAND_STYLE = {
  position: 'absolute',
  top: '10%',
  left: '50%',
  height: '40%',
  width: '1px',
  background: 'black',
  transformOrigin: 'bottom',
  borderRadius: '500px',
};

const HOUR_HAND_STYLE = {
  position: 'absolute',
  top: '30%',
  left: '50%',
  height: '20%',
  width: '4px',
  background: '#ff2701',
  transformOrigin: 'bottom',
  borderRadius: '500px',
};

const MINUTES_HAND_STYLE = {
  position: 'absolute',
  top: '20%',
  left: '50%',
  height: '30%',
  width: '4px',
  background: 'blue',
  transformOrigin: 'bottom',
  borderRadius: '500px',
};

function getStyle(index, time) {
  switch (index) {
    case 1: {
      return {
        ...HOUR_HAND_STYLE,
        transform: `rotate(${time.hour}deg)`,
      };
    }
    case 2: {
      return {
        ...MINUTES_HAND_STYLE,
        transform: `rotate(${time.minutes}deg)`,
      };
    }
    default: {
      return {
        ...SECONDS_HAND_STYLE,
        transform: `rotate(${time.seconds}deg)`,
      };
    }
  }
}

const getValues = (time) => {
  return {
    hour: time.hour * 30 + time.minutes / 2,
    minutes: time.minutes * 6,
    seconds: time.seconds * 6,
  };
};

function Index() {
  const time = useClock({ updateBy: 'second' });
  const previous = useRef(getValues(time));
  const total = useRef(getValues(time));

  const [animations, set] = useSprings(3, (index) => {
    return getStyle(index, total.current);
  });

  useEffect(() => {
    const hourCurrent = time.hour * 30 + time.minutes / 2;
    const hourDelta = hourCurrent - previous.current.hour;

    const minutesCurrent = time.minutes * 6;
    const minutesDelta = minutesCurrent - previous.current.minutes;

    const secondsCurrent = time.seconds * 6;
    const secondsDelta = secondsCurrent - previous.current.seconds;

    const { hour, minutes, seconds } = total.current;
    total.current = {
      hour: hour + hourDelta,
      minutes: minutes + minutesDelta,
      seconds: seconds + secondsDelta,
    };
  }, [previous.hour, previous.minutes, previous.seconds, time.hour, time.minutes, time.seconds]);

  useEffect(() => {
    set((index) => {
      return getStyle(index, total.current);
    }, []);
  }, [set, time, time.hour, time.minutes, time.seconds]);
  console.log(
    'TIME: ',
    JSON.stringify({ time, totals: total.current, previous: previous.current }, null, 2)
  );

  useEffect(() => {
    previous.current = getValues(time);
  }, [time]);

  return (
    <Box height="100vh" width={1} bg="#ebebeb">
      <Centered height="100%" width={1}>
        <Box width="50%" maxWidth="50%">
          <Ratio
            borderRadius="50%"
            width="100%"
            boxShadow="-16px -16px 32px #cacaca, 
            16px 16px 32px #ffffff">
            <Absolute top={0} left={0} height="100%" width={1}>
              <>
                {upTo(0, 11, (key) => {
                  return (
                    <Absolute
                      p={3}
                      display="flex"
                      style={{ transform: `rotate(${key * 30}deg)`, justifyContent: 'center' }}
                      key={key}
                      height="100%"
                      width="100%">
                      <Text
                        color="gray.8"
                        fontSize="18px"
                        fontWeight="light"
                        style={{
                          position: 'absolute',
                          transform: `rotate(${360 - key * 30}deg)`,
                        }}>
                        {key === 0 ? 12 : key}
                      </Text>
                    </Absolute>
                  );
                })}
                <animated.div style={animations[0]} />
                <animated.div style={animations[1]} />
                <animated.div style={animations[2]} />
              </>
            </Absolute>
          </Ratio>
        </Box>
      </Centered>
    </Box>
  );
}

export default withCoreProviders(Index);
