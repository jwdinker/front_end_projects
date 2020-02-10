import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Box, Row, Text, Centered, Fixed, Absolute, Relative } from '@jwdinker/styled-system';

import { WatchTower, useBeacon } from '@jwdinker/watchtower';
import { withCoreProviders } from '../../hocs';

console.log('watchtower: ', WatchTower, useBeacon);

const Contents = () => {
  const ref = useRef();
  const state = useBeacon(ref);

  console.log('STATE: ', state);

  return useMemo(
    () => (
      <Box bg="black" height="3000px" width="3000px">
        <Centered height="100%" width={1}>
          <Box
            bg="white"
            borderRadius="8px"
            boxShadow="0px 5px 15px rgba(0, 0, 0, 0.05), 0px 1px 3px rgba(0, 0, 0, 0.1)"
            height="200px"
            width="200px">
            <Centered width={1} height="100%">
              {/* <Text>{`scrollTop:${scroll.top}`}</Text> */}
            </Centered>
            <Absolute ref={ref} zIndex={-1} bottom={0} left={0} right={0} bg="#7aa9f9"></Absolute>
          </Box>
        </Centered>
      </Box>
    ),
    []
  );
};

WatchTower.getInitialProps = async (context) => {
  return {};
};

const Page = () => {
  const scroller = useRef();
  return (
    <Box width={1} height={'100vh'}>
      <Box height="100%" width="100%" overflow="scroll" ref={scroller} id="scroller">
        <WatchTower ref={scroller}>
          <Contents />
        </WatchTower>
      </Box>
    </Box>
  );
};

export default withCoreProviders(Page);
