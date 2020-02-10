import Link from 'next/link';
import { withCoreProviders } from '../hocs';
import React, { useState } from 'react';
import { Menu, SharedLayout } from '../components';
import { Box, InputGroup, Input, Column, Row, Text } from '@jwdinker/styled-system';
import styled, { withTheme } from 'styled-components';

function Layout({ children, ...props }) {
  const [value, setValue] = useState('');
  return 'here i am';
}

function Index() {
  return <Box>hey</Box>;
}

export default withCoreProviders(Index);
