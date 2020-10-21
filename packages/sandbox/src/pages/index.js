import Link from 'next/link';
import React from 'react';
import { Box } from '@jwdinker/styled-system';

import { withCoreProviders } from '../hocs';

function Index() {
  return <Box>Home</Box>;
}

export default withCoreProviders(Index);
