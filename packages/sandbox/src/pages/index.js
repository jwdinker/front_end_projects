import Link from 'next/link';
import React, { useState } from 'react';
import { Box, InputGroup, Input, Column, Row, Text } from '@jwdinker/styled-system';
import styled, { withTheme } from 'styled-components';
import { Menu, SharedLayout } from '../components';
import { withCoreProviders } from '../hocs';

function Layout({ children, ...props }) {
  const [value, setValue] = useState('');
  return 'here i am';
}

function Index() {
  return <Box>hey</Box>;
}

export default withCoreProviders(Index);
