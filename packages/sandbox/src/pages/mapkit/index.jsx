import React from 'react';
import { Box } from '@jwdinker/styled-system';

import { withCoreProviders } from '../../hocs';

function Index() {
  return <Box height="100%" width={1} />;
}

export default withCoreProviders(Index);
