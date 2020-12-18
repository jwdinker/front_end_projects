import React, { useCallback, useRef, useState } from 'react';

import { Box, Button, Text, Centered, Absolute } from '@jwdinker/styled-system';
import useTimeout from '@jwdinker/use-timeout';
import { withCoreProviders } from '../../hocs';

function Index() {
  const [isScrolling, setScrolling] = useState(false);
  const [start, clear] = useTimeout(() => {
    setScrolling(false);
  }, 50);

  const onScroll = useCallback(() => {
    setScrolling(true);
    clear();
    start();
  }, [clear, start]);

  const color = isScrolling ? '#79ff64' : '#ff6f83';

  return (
    <>
      <Absolute bg="black" zIndex={-1} height="100%" width="100%">
        <Centered height="100%" width={1}>
          <Text fontSize="30px" fontWeight="bold" color="white">
            isScrolling:
          </Text>
          <Text style={{ color }} fontSize="30px" fontWeight="bold" color="white">
            {` ${isScrolling}`}
          </Text>
        </Centered>
      </Absolute>
      <Box height="100vh" width={1} overflow="scroll" onScroll={onScroll}>
        <Box height="5000px" width={1} />
      </Box>
    </>
  );
}

const Page = withCoreProviders(Index);
export default Page;
