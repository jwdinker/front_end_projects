import React from 'react';
import { Button, Centered, Text, Absolute } from '@jwdinker/styled-system';
import useToggle from '@jwdinker/use-toggle';
import { withCoreProviders } from '../../hocs';

function Index() {
  const [active, { activate, deactivate, toggle }] = useToggle(false);

  const color = active ? '#79ff64' : '#ff6f83';

  return (
    <Absolute bg="black" zIndex={-1} height="100%" width="100%">
      <Centered height="100%" width={1}>
        <Button height="100%" width="100%" onClick={toggle}>
          <Text fontSize="30px" fontWeight="bold" color="white">
            Is active?
          </Text>
          <Text style={{ color }} fontSize="30px" fontWeight="bold" color="white">
            {` ${active}`}
          </Text>
        </Button>
      </Centered>
    </Absolute>
  );
}

const Page = withCoreProviders(Index);
export default Page;
