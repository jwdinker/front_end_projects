import Link from 'next/link';
import { withCoreProviders } from '../hocs';
import React, { useState, useRef } from 'react';
import { Menu } from '../components';
import { Box, InputGroup, Input, Column, Row, Text } from '@jwdinker/styled-system';
import useSize from '@jwdinker/use-size';
import styled, { withTheme } from 'styled-components';

function Layout({ children, ...props }) {
  const [value, setValue] = useState('');
  return 'here i am';
}

function UseSizeExample() {
  const element = useRef();
  const size = useSize(element);
  return <Box ref={element}>hey</Box>;
}

export default withCoreProviders(UseSizeExample);
