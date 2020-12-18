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

const getColor = (value) => {
  if (typeof value === 'boolean') {
    return value ? '#79ff64' : '#ff6f83';
  }
  if (typeof value === 'string') {
    return '#ffe43a';
  }

  return '#00a1ff';
};

const KeyValue = ({ name, value }) => {
  const color = getColor(value);
  return (
    <Row>
      <Text fontSize="30px" fontWeight="bold" color="white">{`${name}:`}</Text>
      <Text style={{ color }} fontSize="30px" fontWeight="bold">{`${value}`}</Text>
    </Row>
  );
};

const Contents = () => {
  const [size, isResizing] = useWindowSize(0);

  return useMemo(
    () => (
      <Box bg="black" height="100vh" width="100%">
        <Centered height="100%" width={1}>
          <Box>
            <KeyValue key={isResizing} name="isResizing" value={isResizing} />
            {Object.keys(size).map((property) => {
              const value = size[property];
              return <KeyValue key={property} name={property} value={value} />;
            })}
          </Box>
        </Centered>
      </Box>
    ),
    [isResizing, size]
  );
};

export default withCoreProviders(Contents);
