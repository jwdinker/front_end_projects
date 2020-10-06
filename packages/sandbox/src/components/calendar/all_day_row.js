import React from 'react';
import { Box, Row, Text, Button, Absolute } from '@jwdinker/styled-system';

function AllDayRow({ date, onClick }) {
  return (
    <Row minHeight="29px">
      <Row>
        <Absolute right="20%">
          <Box style={{ transform: 'translateY(-50%)' }}>
            <Text color="#b1b1b3" fontSize="12px" display="inline-block">
              all-day
            </Text>
          </Box>
        </Absolute>
      </Row>

      <Button
        onClick={onClick}
        border="transparent"
        flex={19}
        borderTop="1px solid"
        borderBottom="4px solid"
        borderColor="#e0e0e0"
      />
    </Row>
  );
}

export default AllDayRow;
