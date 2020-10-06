import React from 'react';
import { Box, Button, Centered, Text } from '@jwdinker/styled-system';
import useToggle from '@jwdinker/use-toggle';
import { withCoreProviders } from '../../hocs';

function UseToggleExample() {
  const [active, helpers] = useToggle();

  const { toggle } = helpers;

  return (
    <Box height="100vh" width="100%">
      <Centered width={1} height="100%">
        <Button bg={active ? 'green.4' : 'red.4'} width="80%" height="60%" onClick={toggle}>
          <Text fontSize="64px">{active ? 'deactivate' : 'activate'}</Text>
        </Button>
      </Centered>
    </Box>
  );
}

export default withCoreProviders(UseToggleExample);
