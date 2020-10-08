import React from 'react';
import useClock from '@jwdinker/use-clock';
import { Box, Centered, Text, Row, Column, Flex } from '@jwdinker/styled-system';

import { withCoreProviders } from '../../hocs';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function Index() {
  const time = useClock({ updateBy: 'second' });

  const { hour, minutes, seconds, period, dayOfWeek } = time;

  const formatted = [seconds, minutes, hour].map((value) => (value < 10 ? `0${value}` : value));

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
                    fontSizeFluid={['50px', '100px']}>{`${formatted[2]}:${formatted[1]}`}</Text>
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
                        {formatted[0]}
                      </Text>
                    </Centered>
                  </Row>
                </Column>
              </Row>
            </Row>
            <Row>
              <Text color="white" fontWeight="semiBold">
                {DAYS_OF_WEEK[dayOfWeek - 1]}
              </Text>
            </Row>
          </Column>
        </Box>
      </Centered>
    </Box>
  );
}

export default withCoreProviders(Index);
