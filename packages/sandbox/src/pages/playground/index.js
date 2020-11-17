import React, { useState, useRef, useEffect, useMemo, forwardRef, useLayoutEffect } from 'react';
import { Box, Row, Text, Centered, Fixed, Absolute, Relative } from '@jwdinker/styled-system';
import { getContainingBlock } from '@jwdinker/get-containing-block';
import titleCase from '@jwdinker/title-case';

import { withCoreProviders } from '../../hocs';

const Index = () => {
  const ref = useRef();

  return (
    <Box id="parent">
      <Absolute ref={ref}>test</Absolute>
    </Box>
  );
};

export default withCoreProviders(Index);
