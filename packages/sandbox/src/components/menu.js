import Link from 'next/link';

import React, { useState } from 'react';
import { Box, Column, Row, Text } from '@jwdinker/styled-system';

function Menu({ children, ...props }) {
  return (
    <Column bg="gray.0">
      <Box>
        <Link href="/use_animation_frame">
          <Text>useAnimationFrame</Text>
        </Link>
      </Box>
      <Box>
        <Link href="/watchtower">
          <Text>WatchTower</Text>
        </Link>
      </Box>
      <Box>
        <Link href="/use_size">
          <Text>useSize</Text>
        </Link>
      </Box>
      <Box>
        <Link href="/use_event_listener">
          <Text>useEventListener</Text>
        </Link>
      </Box>
    </Column>
  );
}

export default Menu;
