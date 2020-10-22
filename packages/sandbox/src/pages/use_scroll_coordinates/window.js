import React, { useEffect, useRef, useMemo } from 'react';
import { Box, Centered, Column, Text, Row, Fixed } from '@jwdinker/styled-system';

import upTo from '@jwdinker/up-to';
import useScrollCoordinates from '@jwdinker/use-scroll-coordinates';
import useSSR from '@jwdinker/use-ssr';
import { withCoreProviders } from '../../hocs';

function Contents() {
  return useMemo(
    () =>
      upTo(0, 20, (key) => {
        return (
          <Box
            bg="black"
            key={key}
            width={1}
            height="300px"
            borderBottom="1px solid"
            borderColor="white">
            <Centered width={1} height="100%">
              <Text color="white" fontWeight="bold" fontSizeFluid={['20px', '60px']}>
                {key}
              </Text>
            </Centered>
          </Box>
        );
      }),
    []
  );
}

function Coordinates() {
  const { isBrowser } = useSSR();

  const element = isBrowser ? document : null;
  const scroll = useScrollCoordinates(element);

  return (
    <>
      <Row>
        <Text fontWeight="bold" fontSizeFluid={['12px', '50px']}>
          {`scrollX: ${scroll.x}`}
        </Text>
      </Row>
      <Row>
        <Text fontWeight="bold" fontSizeFluid={['12px', '50px']}>
          {`scrollY: ${scroll.y}`}
        </Text>
      </Row>
    </>
  );
}

function Info({ children }) {
  return (
    <Fixed
      zIndex={9999}
      borderRadius="8px"
      p={2}
      bg="white"
      right="3%"
      top="3%"
      boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)">
      <Centered height="100%" width={1}>
        <Box>
          <Column>{children}</Column>
        </Box>
      </Centered>
    </Fixed>
  );
}

function BlockScrollExample() {
  return (
    <>
      <Contents />
      <Info>
        <Coordinates />
      </Info>
    </>
  );
}

export default withCoreProviders(BlockScrollExample);
