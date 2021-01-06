import React from 'react';
import { Button, Centered, Text, Absolute } from '@jwdinker/styled-system';
import useToggle from '@jwdinker/use-toggle';
import { withCoreProviders } from '../../hocs';

function Index() {
  const [active, { activate, deactivate, toggle }] = useToggle(false);

  const color = active ? '#79ff64' : '#ff6f83';

  return <button onClick={toggle}>{`isActive: ${active}`}</button>;
}

const Page = withCoreProviders(Index);
export default Page;
