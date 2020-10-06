import React, { useState, useRef, useEffect, useMemo, forwardRef, useLayoutEffect } from 'react';
import { Box, Row, Text, Centered, Fixed, Absolute, Relative, box } from '@jwdinker/styled-system';

import { useSprings, animated, useSpring } from 'react-spring';
import styled from 'styled-components';
import useScroll, { ScrollBroadcast, useScrollBeacon } from '@jwdinker/use-scroll';
import { withCoreProviders } from '../../hocs';

const ScrollBeaconElement = () => {
  const scroll = useScrollBeacon();
  console.log('SCROLL STATE: ', JSON.stringify(scroll, null, 2));
  return null;
};

const Contents = () => {
  const element = useRef();

  return (
    <ScrollBroadcast element={element}>
      <Box
        height="100%"
        ref={element}
        maxHeight="100vh"
        width={1}
        style={{ WebkitOverflowScrolling: 'touch', overflow: 'scroll' }}>
        <Box bg="white" height="3000px" width="3000px">
          <Centered height="100%" width={1}>
            <Box
              bg="blue.5"
              borderRadius="8px"
              boxShadow="0px 5px 15px rgba(0, 0, 0, 0.05), 0px 1px 3px rgba(0, 0, 0, 0.1)"
              height="200px"
              width="200px">
              <Centered position="relative" width={1} height="100%">
                <Absolute
                  zIndex={1}
                  height="40px"
                  width="20px"
                  right="-20px"
                  top="50%"
                  style={{ transform: 'translate3d(0,-50%,0)' }}
                  border="solid 1px"
                  borderColor="blue.5"
                />
                <Absolute
                  height="440px"
                  width="440px"
                  left="-120px"
                  top="-120px"
                  border="solid 1px"
                  borderColor="blue.5"
                />
                <Absolute
                  height="100px"
                  width="100px"
                  top="-120px"
                  right="50px"
                  border="solid 1px"
                  borderColor="blue.5"
                />
                <Absolute height="100%" width="50%" left="50%" border="solid 1px" />
                <Absolute height="50%" width="100%" top="50%" border="solid 1px" />
                <Text>Pilot</Text>
              </Centered>
            </Box>
            <ScrollBeaconElement />
          </Centered>
        </Box>
      </Box>
    </ScrollBroadcast>
  );
};

export default withCoreProviders(Contents);
