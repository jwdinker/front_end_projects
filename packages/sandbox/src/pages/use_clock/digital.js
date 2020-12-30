import React from 'react';
import useClock, { to00, get12Hour, timeOfDay, nameOfDay } from '@jwdinker/use-clock';
import { Box, Centered, Text, Row, Column, Flex } from '@jwdinker/styled-system';

import { withCoreProviders } from '../../hocs';

function Index() {
  const time = useClock((date) => {
    return {
      seconds: to00(date.getSeconds()),
      hour: get12Hour(date),
      minutes: to00(date.getMinutes()),
      day: date.getDate(),
      dayOfWeek: nameOfDay(date, 'ddd'),
      period: timeOfDay(date),
    };
  }, 'second');

  const { hour, minutes, seconds, period, dayOfWeek } = time;

  return (
    <Box height="100vh" width={1} bg="#ebebeb">
      <Centered height="100%" width={1}>
        <Box p={4} bg="black" borderRadius="8px" boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)">
          <Column bg="gray.8" p={1} borderRadius="8px">
            <Row>
              <Row flex={9} minWidth="220px">
                <Flex justifyContent="center" width={1}>
                  <Text
                    color="white"
                    fontWeight="bold"
                    fontSizeFluid={['50px', '100px']}>{`${hour}:${minutes}`}</Text>
                </Flex>
              </Row>
              <Row flexShrink={0}>
                <Column>
                  <Row>
                    <Centered>
                      <Text color="white" fontWeight="semiBold">
                        {period.toUpperCase()}
                      </Text>
                    </Centered>
                  </Row>
                  <Row minWidth="20px">
                    <Centered>
                      <Text color="white" fontWeight="semiBold">
                        {seconds}
                      </Text>
                    </Centered>
                  </Row>
                </Column>
              </Row>
            </Row>
            <Row>
              <Text color="white" fontWeight="semiBold">
                {dayOfWeek}
              </Text>
            </Row>
          </Column>
        </Box>
      </Centered>
    </Box>
  );
}

export default withCoreProviders(Index);
