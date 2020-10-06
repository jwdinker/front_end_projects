import React, { useState, useRef, useEffect, useMemo, forwardRef, useLayoutEffect } from 'react';
import {
  Box,
  Row,
  Text,
  Centered,
  Fixed,
  Absolute,
  Relative,
  Column,
} from '@jwdinker/styled-system';
import useWindowSize from '@jwdinker/use-window-size';
import { withCoreProviders } from '../../hocs';

const Contents = () => {
  const [size, isResizing] = useWindowSize();

  console.log('SIZE: ', size, 'isResizing:', isResizing);

  return useMemo(
    () => (
      <Box height="100%" width="100%">
        <Centered height="100%" width={1}>
          <Box>
            <Box>{`isResizing:${isResizing}`}</Box>
            {Object.keys(size).map((property) => {
              const value = size[property];
              return <Box key={property}>{`${property}:${value}`}</Box>;
            })}
          </Box>
        </Centered>
      </Box>
    ),
    [isResizing, size]
  );
};

export default withCoreProviders(Contents);
