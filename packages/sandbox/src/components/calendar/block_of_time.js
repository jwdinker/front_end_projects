import React, { useCallback, useState, useEffect } from 'react';
import { Box, Column, Row, Flex, Text, Button, Absolute, Centered } from '@jwdinker/styled-system';

import { withCoreProviders } from '../../hocs';

function BlockOfTime({ hour, period, onClick }) {
  return (
    <Row key={`${hour}-${period}`} minHeight="100px">
      <Row>
        <Absolute right="20%">
          <Box style={{ transform: 'translateY(-50%)' }}>
            <Text color="#b1b1b3" fontSize="12px" display="inline-block">
              {`${hour} ${period.toUpperCase()}`}
            </Text>
          </Box>
        </Absolute>
      </Row>

      <Button
        onClick={onClick}
        border="transparent"
        flex={19}
        borderBottom="1px solid"
        borderColor="#e0e0e0">
        <Absolute borderTop="1px solid" borderColor="#f8f8f8" width={1} top="50px" />

        {/* <Absolute height="25%" width={1} top={0} bg="blue.0" />
              <Absolute height="25%" width={1} top="25%" bg="red.0" />
              <Absolute height="25%" width={1} top="50%" bg="green.0" />
              <Absolute height="25%" width={1} top="75%" bg="yellow.0" /> */}
      </Button>
    </Row>
  );
}

export default withCoreProviders(BlockOfTime);
