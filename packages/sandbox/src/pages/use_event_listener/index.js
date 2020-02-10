import React, { useState, useRef, useEffect } from 'react';
import { Box, Row, Text, Centered, Fixed, Absolute, Relative } from '@jwdinker/styled-system';

import useEventListener from '@jwdinker/use-event-listener';
import { withCoreProviders } from '../../hocs';

const ContainerScrolling = () => {
  const ref = useRef();
  const [scroll, setScroll] = useState({ top: 0, left: 0 });

  const [attach, detach] = useEventListener({
    target: ref,
    type: 'scroll',
    handler: (event) => {
      const { scrollTop, scrollLeft } = event.target;

      setScroll({ top: scrollTop, left: scrollLeft });
    },
  });

  return (
    <Box width={1} height={'100vh'}>
      <Fixed top={0} left={0} bottom={0} right={0} style={{ pointerEvents: 'none' }}>
        <Centered height="100%" width={1}>
          <Box
            bg="white"
            borderRadius="8px"
            boxShadow="0px 5px 15px rgba(0, 0, 0, 0.05), 0px 1px 3px rgba(0, 0, 0, 0.1)"
            height="200px"
            width="200px">
            <Centered width={1} height="100%">
              <Text>{`scrollTop:${scroll.top}`}</Text>
            </Centered>
            <Absolute
              zIndex={-1}
              style={{ height: `${scroll.top}px` }}
              bottom={0}
              left={0}
              right={0}
              bg="#7aa9f9"></Absolute>
          </Box>
        </Centered>
      </Fixed>

      <Box
        height="100%"
        width="100%"
        overflow="scroll"
        ref={ref}
        id="scroller"
        onScroll={() => {
          console.log('SCROLLING');
        }}>
        <Box bg="black" height="3000px" width="3000px"></Box>
        <Box bg="red" height="3000px" width="3000px"></Box>
      </Box>
    </Box>
  );
};

export default withCoreProviders(ContainerScrolling);
