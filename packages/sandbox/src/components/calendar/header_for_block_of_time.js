import React from 'react';
import { Box, Column, Row, Flex, Text, Button, Absolute, Centered } from '@jwdinker/styled-system';
import { useFormat } from '@jwdinker/calendar';

function HeaderForBlockOfTime({ date }) {
  const [dayOfWeek, nameOfMonth, dayOfMonth, year] = useFormat(date, 'EEEE MMMM d, yyyy').split(
    ' '
  );

  return (
    <Box py={3}>
      <Row>
        <Text px={1} fontSize="28px" fontWeight="thin" color="#0b99ff">
          {dayOfWeek}
        </Text>
        <Text px={1} fontSize="28px" fontWeight="regular">
          {`${nameOfMonth} ${dayOfMonth}`}
        </Text>
        <Text px={1} fontSize="28px" fontWeight="thin" color="#e62322">
          {year}
        </Text>
      </Row>
    </Box>
  );
}

export default HeaderForBlockOfTime;
