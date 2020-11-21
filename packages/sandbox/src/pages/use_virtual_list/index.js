import React, { useRef, useCallback, useMemo, createElement, useEffect, useState } from 'react';
import { Box, Centered, Text, Absolute, Button, Relative, Input } from '@jwdinker/styled-system';
import useMeasurementsIndexer from '@jwdinker/use-measurements-indexer';
import upTo from '@jwdinker/up-to';
import { useScroll } from '@jwdinker/use-scroll';
import useWindowSize from '@jwdinker/use-window-size';
import useVirtualList, { VirtualScroller, areEqual } from '@jwdinker/use-virtual-list';
import { withCoreProviders } from '../../hocs';

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const NUMBER_OF_ITEMS = 10000;
const HALFWAY = Math.floor(NUMBER_OF_ITEMS / 2);
const sizes = upTo(1, NUMBER_OF_ITEMS, () => {
  return randomIntFromInterval(100, 600);
});

const MyComponent = ({ style, index }) => {
  console.log('INDEX: ', index);
  return (
    <Box style={style}>
      <Centered border="1px solid" width={1} height="100%">
        <Text fontSizeFluid={['25px', '75px']}>{index}</Text>
      </Centered>
    </Box>
  );
};

const MemoizedComponent = React.memo(MyComponent, areEqual);

const inputStyle = {
  background: 'none',
  color: 'white',
  fontSize: '20px',
  fontWeight: '700',
  outline: 'none',
  borderRadius: '8px',
};

function Index() {
  const [props, { scrollTo }] = useVirtualList({
    component: MemoizedComponent,
    itemSize: 30,
    layout: 'vertical',
    responsive: true,
    numberOfItems: NUMBER_OF_ITEMS,
    estimatedItemSize: 30,
  });

  const [currentIndex, setIndex] = useState(0);

  const handleChange = useCallback(({ target: { value } }) => {
    if (!Number.isNaN(value)) {
      const min = Math.max(0, value);
      const max = Math.min(value, NUMBER_OF_ITEMS);
      setIndex(max);
    }
  }, []);

  useEffect(() => {
    scrollTo(currentIndex);
  }, [currentIndex, scrollTo]);

  return (
    <Box height="100vh" width={1}>
      <Absolute
        zIndex={1}
        right={0}
        top={0}
        px={3}
        py={2}
        borderRadius="8px"
        boxShadow="0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05)"
        bg="#202a37">
        <input style={inputStyle} onChange={handleChange} value={currentIndex} />
      </Absolute>
      <Box height="100%" width={1} border="solid 1px">
        <VirtualScroller {...props} />
      </Box>
    </Box>
  );
}

export default withCoreProviders(Index);
