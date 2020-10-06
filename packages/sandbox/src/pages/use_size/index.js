import Link from 'next/link';
import React, { useState, useRef } from 'react';
import { Box, InputGroup, Input, Column, Row, Text } from '@jwdinker/styled-system';
import useSize from '@jwdinker/use-size';
import styled, { withTheme } from 'styled-components';

import { withCoreProviders } from '../../hocs';

function Layout({ children, ...props }) {
  const [value, setValue] = useState('');
  return 'here i am';
}

function Index() {
  const element = useRef();
  const size = useSize(element);
  console.log('size: ', size);
  return (
    <Box width={1} height="100vh" ref={element}>
      hey
    </Box>
  );
}

export default withCoreProviders(Index);
