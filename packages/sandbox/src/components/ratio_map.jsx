import React, { forwardRef } from 'react';
import { Box, Relative, Absolute } from '@jwdinker/styled-system';

const RatioMap = forwardRef(({ children }, ref) => {
  return (
    <Box width={1} maxWidth="700px">
      <Relative
        height="0px"
        width="100%"
        pt="66%"
        overflow="hidden"
        borderRadius="16px"
        boxShadow="0px 5px 15px rgba(0, 0, 0, 0.05), 0px 1px 3px rgba(0, 0, 0, 0.1)">
        <Absolute ref={ref} top={0} left={0} height="100%" width="100%">
          {children}
        </Absolute>
      </Relative>
    </Box>
  );
});

RatioMap.displayName = 'RatioMap';

export default RatioMap;
