import React, { useState, useRef, useEffect, useMemo, forwardRef } from 'react';
import { Box, Row, Text, Centered, Fixed, Absolute, Relative } from '@jwdinker/styled-system';

import {
  getVisiblePercentage,
  getVisiblePixels,
  getOverflowedSides,
  getEdgesOverflowing,
  getAtSides,
  isVisible,
} from '@jwdinker/visibility-helpers';
import useBoundingClientRect from '@jwdinker/use-bounding-client-rect';
import { withCoreProviders } from '../../hocs';

const Component = forwardRef((props, ref) => {
  return (
    <Box bg="black" height="3000px" width="3000px">
      <Centered height="100%" width={1} position="relative">
        <Box
          ref={ref}
          bg="white"
          borderRadius="8px"
          boxShadow="0px 5px 15px rgba(0, 0, 0, 0.05), 0px 1px 3px rgba(0, 0, 0, 0.1)"
          height="200px"
          width="200px">
          <Centered width={1} height="100%">
            {/* <Text>{`scrollTop:${scroll.top}`}</Text> */}
          </Centered>
        </Box>
      </Centered>
    </Box>
  );
});

const Page = () => {
  const containerRef = useRef();
  const elementRef = useRef();

  const [container, containerHandlers] = useBoundingClientRect(containerRef);
  const [element, elementHandlers] = useBoundingClientRect(elementRef);

  const visiblePercentage = getVisiblePercentage(element, container);
  const visiblePixels = getVisiblePixels(element, container);

  useEffect(() => {
    containerHandlers.watch();
    elementHandlers.watch();
    return () => {
      containerHandlers.unwatch();
      elementHandlers.unwatch();
    };
  }, [containerHandlers, elementHandlers]);

  console.log(
    'Element Status:\n',
    JSON.stringify(
      {
        visible: isVisible(element, container),
        at: getAtSides(element, container),
        overflowing: {
          sides: getOverflowedSides(element, container),
          edges: getEdgesOverflowing(element, container),
        },
        visibility: {
          percent: visiblePercentage,
          pixels: visiblePixels,
        },
      },
      null,
      2
    )
  );
  return (
    <Box width={1}>
      <Box
        height="100%"
        width="100%"
        maxHeight="100vh"
        overflow="scroll"
        ref={containerRef}
        id="scroller">
        <Component ref={elementRef} />
      </Box>
    </Box>
  );
};

export default withCoreProviders(Page);
