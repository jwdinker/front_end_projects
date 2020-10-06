import React, { useRef, useMemo } from 'react';
import { Box, Centered, Button } from '@jwdinker/styled-system';

import useBoundingClientRect from '@jwdinker/use-bounding-client-rect';
import useToggle from '@jwdinker/use-toggle';
import { withCoreProviders } from '../../hocs';

const Contents = () => {
  const element = useRef();
  const [measurements, watch, unwatch] = useBoundingClientRect(element);

  const [active, { toggle }] = useToggle();

  const style = active
    ? { height: '300px', width: '300px', bg: 'green.5' }
    : { height: '100px', width: '100px', bg: 'red.5' };

  console.log('\n\nMeasurements: ', JSON.stringify(measurements, null, 2), '\n\n');

  return useMemo(
    () => (
      <Box height="100%" maxWidth="50%">
        <Box>
          <Button onClick={watch}>watch</Button>
          <Button onClick={unwatch}>unwatch</Button>
          <Button onClick={toggle}>toggle</Button>
        </Box>
        <Centered height="100%" width={1}>
          <Box ref={element} {...style}>
            Watching this BOx
          </Box>
        </Centered>
      </Box>
    ),
    [style, toggle, unwatch, watch]
  );
};

export default withCoreProviders(Contents);
