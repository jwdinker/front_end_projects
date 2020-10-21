import React, { useEffect, useRef, forwardRef } from 'react';
import useClock from '@jwdinker/use-clock';
import { Box, Centered, Ratio, Absolute, Text } from '@jwdinker/styled-system';
import upTo from '@jwdinker/up-to';

import { withCoreProviders } from '../../hocs';

const SecondHand = forwardRef((props, ref) => {
  return (
    <Absolute
      ref={ref}
      top="10%"
      left="50%"
      height="40%"
      width="1%"
      background="black"
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
      borderRadius="500px"
      style={{ transformOrigin: 'bottom' }}
    />
  );
});

const HourHand = forwardRef((props, ref) => {
  return (
    <Absolute
      ref={ref}
      top="30%"
      left="50%"
      height="20%"
      width="3%"
      background="black"
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
      borderRadius="500px"
      style={{ transformOrigin: 'bottom' }}
    />
  );
});

const MinuteHand = forwardRef((props, ref) => {
  return (
    <Absolute
      ref={ref}
      top="20%"
      left="50%"
      height="30%"
      width="2%"
      background="black"
      boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      borderRadius="500px"
      style={{ transformOrigin: 'bottom' }}
    />
  );
});

const CenterCircle = () => {
  return (
    <Absolute
      boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      zIndex={999}
      top="50%"
      left="51%"
      height="5%"
      bg="red.5"
      width="5%"
      borderRadius="50%"
      style={{ transform: `translate3d(-50%,-50%,0)` }}
    />
  );
};

const HourLabels = () => {
  return upTo(0, 11, (key) => {
    return (
      <Absolute
        p="2%"
        display="flex"
        style={{ transform: `rotate(${key * 30}deg)`, justifyContent: 'center' }}
        key={key}
        height="100%"
        width="100%">
        <Text
          color="gray.8"
          fontSizeFluid={['8px', '50px']}
          fontWeight="light"
          style={{
            position: 'absolute',
            transform: `rotate(${360 - key * 30}deg)`,
          }}>
          {key === 0 ? 12 : key}
        </Text>
      </Absolute>
    );
  });
};

function AnalogClock() {
  const time = useClock('second', 100);

  const minuteHand = useRef();
  const hourHand = useRef();
  const secondsHand = useRef();

  useEffect(() => {
    secondsHand.current.style.transform = `rotate(${time.seconds * 6}deg)`;
    minuteHand.current.style.transform = `rotate(${time.minutes * 6}deg)`;
    hourHand.current.style.transform = `rotate(${time.hour * 30 + time.minutes / 2}deg)`;
  }, [time.hour, time.seconds, time.minutes]);

  return (
    <Box height="100vh" width={1} bg="#ebebeb" overflow="scroll">
      <Centered height="100%" width={1}>
        <Box width="50%" maxWidth="50%" position="relative">
          <CenterCircle />

          <Ratio
            position="relative"
            borderRadius="50%"
            width="100%"
            boxShadow="-16px -16px 32px #cacaca, 
            16px 16px 32px #ffffff">
            <Absolute top={0} left={0} height="100%" width={1}>
              <HourLabels />
              <MinuteHand ref={minuteHand} />
              <HourHand ref={hourHand} />
              <SecondHand ref={secondsHand} />
            </Absolute>
          </Ratio>
        </Box>
      </Centered>
    </Box>
  );
}

export default withCoreProviders(AnalogClock);
