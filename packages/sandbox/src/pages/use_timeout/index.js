import React, { useCallback, useRef, useState } from 'react';

import { Box, Button, Text, Centered, Absolute } from '@jwdinker/styled-system';
import useTimeout from '@jwdinker/use-timeout';
import { withCoreProviders } from '../../hocs';

function Index() {
  const [isScrolling, setScrolling] = useState(false);
  const [start, clear] = useTimeout(() => {
    console.log('Timed out!');
    setScrolling(false);
  }, 50);

  const onScroll = useCallback(() => {
    setScrolling(true);
    clear();
    start();
  }, [clear, start]);

  return (
    <>
      <Absolute zIndex={1}>
        <Text color="white">{`isScrolling:${isScrolling}`}</Text>
      </Absolute>
      <Box height="100vh" width={1} bg="black" overflow="scroll" onScroll={onScroll}>
        <Box height="5000px" width={1} />
      </Box>
    </>
  );
}

const Page = withCoreProviders(Index);
export default Page;
