import React, { useRef, useEffect } from 'react';
import { Box, Button } from '@jwdinker/styled-system';
import usePortal from '@jwdinker/use-portal';
import { withCoreProviders } from '../../hocs';

const Contents = () => {
  const ref = useRef();

  const [Portal, { open, close }] = usePortal((container) => {
    container.style = 'position:absolute; top:0; background:red; height:100px; width:100px;';
  });

  useEffect(() => {
    // open();
  }, [open]);

  return (
    <Box height="100vh" width="100%">
      <Portal>HEY THERE MY DUDE</Portal>
      <Box height="1000px" width="1000px" bg="blue.5" ref={ref} position="relative" />
      <Button onClick={open}>Open</Button>
      <Button onClick={close}>Close</Button>
    </Box>
  );
};

export default withCoreProviders(Contents);
