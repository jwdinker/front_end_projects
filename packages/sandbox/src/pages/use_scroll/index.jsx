import React, { useRef } from 'react';
import { Box, Text, Centered, Absolute } from '@jwdinker/styled-system';

import { useScroll } from '@jwdinker/use-scroll';

import { withCoreProviders } from '../../hocs';

const Contents = () => {
  const element = useRef();
  const [scroll, scrollTo] = useScroll(element);

  console.log('Scroll State: ', JSON.stringify(scroll, null, 2), '\n\n');

  return (
    <Box
      height="100%"
      ref={element}
      maxHeight="100vh"
      width={1}
      style={{ WebkitOverflowScrolling: 'touch', overflow: 'scroll' }}>
      <Box height="10000px" width={1} />
    </Box>
  );
};

export default withCoreProviders(Contents);
