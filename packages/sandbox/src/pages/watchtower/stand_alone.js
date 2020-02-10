import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Box, Row, Text, Centered, Fixed, Absolute, Relative } from '@jwdinker/styled-system';

import { useWatchTower } from '@jwdinker/watchtower';
import { withCoreProviders } from '../../hocs';
import useElementVisibility from '@jwdinker/use-element-visibility';

const Contents = () => {
  const ref = useRef();
  const { element, container } = useWatchTower(ref);

  const state = useElementVisibility(element, container);

  console.log('\n\n\nstate: ', JSON.stringify({ state }, null, 2));
  return useMemo(
    () => (
      <Box height="100%" width={1} maxHeight="100vh" overflow="scroll">
        <Box bg="black" height="3000px" width="3000px">
          <Centered height="100%" width={1}>
            <Box
              ref={ref}
              bg="white"
              borderRadius="8px"
              boxShadow="0px 5px 15px rgba(0, 0, 0, 0.05), 0px 1px 3px rgba(0, 0, 0, 0.1)"
              height="200px"
              width="200px">
              <Centered width={1} height="100%">
                <Text>Watched Box</Text>
              </Centered>
            </Box>
          </Centered>
        </Box>
      </Box>
    ),
    []
  );
};

export default withCoreProviders(Contents);
