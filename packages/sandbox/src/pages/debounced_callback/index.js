import React, { useCallback, useRef, useState } from 'react';

import { Box, Button, Text } from '@jwdinker/styled-system';
import useDebouncedCallback from '@jwdinker/use-debounced-callback';
import { withCoreProviders } from '../../hocs';

function Index() {
  const [scrollY, setScrollY] = useState(0);

  const handler = (event) => {
    console.log('CLICKED');
    // const y = event.target.scrollTop;
    // // console.log('SCROLL TOP: ', y);
    // // setScrollY(y);
  };

  const onScroll = useDebouncedCallback(handler, 2000, false);

  const handleScroll = useCallback(
    (e) => {
      e.persist();
      onScroll(e);
    },
    [onScroll]
  );

  return (
    <Box height="250vh" width="250vw" bg="black">
      <Button onClick={handleScroll}>
        <Text color="white">click me</Text>
      </Button>
      <Box height="500px" width="500px" bg="gray.5" overflow="scroll" onScroll={handleScroll}>
        <Box height="300vh" width={1} bg="gray.1" />
      </Box>
      {scrollY}
    </Box>
  );
}

const Page = withCoreProviders(Index);
export default Page;
