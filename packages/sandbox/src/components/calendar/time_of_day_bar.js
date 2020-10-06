import React, { useRef } from 'react';
import { Box, Row, Text, Centered, Absolute } from '@jwdinker/styled-system';

function TimeOfDayBar({ top = 0, children }) {
  return (
    <Absolute top={top} width={1}>
      <Box style={{ transform: 'translateY(-50%)' }} width={1}>
        <Row>
          <Text
            whiteSpace="nowrap"
            color="#e62322"
            fontWeight="medium"
            fontSize="12px"
            display="inline-block">
            {children}
          </Text>

          <Box>
            <Centered position="absolute">
              <Row>
                <Box mx={1} bg="#e62322" borderRadius="50%" height="12px" width="12px" />
              </Row>
            </Centered>
          </Box>

          <Box width={1}>
            <Absolute top="50%" bg="#e62322" height="1px" width={1} />
          </Box>
        </Row>
      </Box>
    </Absolute>
  );
}

export default TimeOfDayBar;
