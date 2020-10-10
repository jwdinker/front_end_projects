import React, { useEffect, useRef } from 'react';
import { Box, Centered, Column, Text, Row, Absolute } from '@jwdinker/styled-system';
import useBlockScroll from '@jwdinker/use-block-scroll';
import upTo from '@jwdinker/up-to';
import useToggle from '@jwdinker/use-toggle';
import { withCoreProviders } from '../../hocs';

function BlockScrollExample() {
  const element = useRef();

  const [isBlocking, { activate, deactivate }] = useToggle();
  const [enable, disable] = useBlockScroll(element, { onBlock: activate, onUnblock: deactivate });

  useEffect(() => {
    enable();
    return disable;
  }, [disable, enable]);

  return (
    <Box height="200vh" width={1}>
      <Box height="100vh" width={1} bg="black">
        <Centered height="100%" width={1}>
          <Box height="60%" width="60%">
            <Box
              ref={element}
              height="100%"
              maxHeight="100%"
              width={1}
              overflow="scroll"
              bg="white"
              borderRadius="8px"
              boxShadow="inset 0 4px 6px -1px rgba(0, 0, 0, 0.1), inset 0 2px 4px -1px rgba(0, 0, 0, 0.06)">
              {upTo(0, 20, (key) => {
                return (
                  <Box
                    key={key}
                    width={1}
                    height="100px"
                    borderBottom="1px solid"
                    borderColor="#364046">
                    <Centered width={1} height="100%">
                      <Text color="black" fontWeight="bold" fontSizeFluid={['14px', '20px']}>
                        {key}
                      </Text>
                    </Centered>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Centered>
      </Box>

      <Box height="100vh" width={1}>
        <Centered height="100%" width={1}>
          <Text fontWeight="bold" fontSizeFluid={['12px', '50px']}>
            Rest of the Body
          </Text>
        </Centered>
      </Box>

      <Absolute
        zIndex={9999}
        borderRadius="8px"
        p={2}
        bg="white"
        right="3%"
        top="3%"
        boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        style={{ background: isBlocking ? '#79ff64' : '#ff6f83' }}>
        <Centered height="100%" width={1}>
          <Box>
            <Column>
              <Row>
                <Text fontWeight="bold" fontSizeFluid={['12px', '50px']}>
                  {`isBlocking: ${isBlocking}`}
                </Text>
              </Row>
            </Column>
          </Box>
        </Centered>
      </Absolute>
    </Box>
  );
}

export default withCoreProviders(BlockScrollExample);
