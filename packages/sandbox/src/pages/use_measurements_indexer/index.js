import React, { useRef, useCallback, useMemo, createElement, useEffect } from 'react';
import { Box, Centered, Text, Absolute, Button, Relative } from '@jwdinker/styled-system';
import useMeasurementsIndexer from '@jwdinker/use-measurements-indexer';
import upTo from '@jwdinker/up-to';
import { useScroll } from '@jwdinker/use-scroll';
import useWindowSize from '@jwdinker/use-window-size';
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

const NUMBER_OF_ITEMS = 50;
const HALFWAY = Math.floor(NUMBER_OF_ITEMS / 2);
const sizes = upTo(1, NUMBER_OF_ITEMS, () => {
  return randomIntFromInterval(100, 600);
});

const MyComponent = ({ style, index }) => {
  return (
    <Box style={style}>
      <Centered width={1} height="100%">
        <Text fontSizeFluid={['25px', '75px']}>{index + 1}</Text>
      </Centered>
    </Box>
  );
};

function Index() {
  const container = useRef();
  const cachedProps = useRef({});

  const [_window, hasSizeChanged] = useWindowSize();

  const [scroll] = useScroll(container);

  const getSize = (index) => {
    return sizes[index];
  };

  const saveProps = (index, { size, offset }) => {
    cachedProps.current[index] = {
      key: index,
      index,
      style: {
        position: 'absolute',
        height: `${size}px`,
        width: '100%',
        top: `${offset}px`,
        background: getRandomColor(),
      },
    };
  };

  const {
    getMeasurements,
    getIndexByOffset,
    getIndexRangeFromOffsets,
    clearMeasurements,
    getTotalSize,
  } = useMeasurementsIndexer({
    itemSize: getSize,
    numberOfItems: NUMBER_OF_ITEMS,
    estimatedItemSize: 600,
    onMeasure: saveProps,
    log: true,
  });

  useEffect(() => {
    if (hasSizeChanged) {
      cachedProps.current = {};
      clearMeasurements();
    }
  }, [clearMeasurements, hasSizeChanged]);

  const canRender = _window.height !== 0;

  const indexes = canRender
    ? getIndexRangeFromOffsets(scroll.y, scroll.y + _window.height)
    : [0, 0];

  const startIndex = Math.max(indexes[0], 0);
  const endIndex = Math.min(indexes[1], NUMBER_OF_ITEMS);

  const scrollTo = useCallback(() => {
    const { offset } = getMeasurements(HALFWAY - 1);
    container.current.scrollTo(0, offset);
  }, [getMeasurements]);

  const totalSize = getTotalSize();

  console.log('get total size: ', totalSize);

  const items = useMemo(() => {
    if (!canRender) {
      return [];
    }
    return upTo(startIndex, endIndex, (index) => {
      return createElement(MyComponent, cachedProps.current[index]);
    });
  }, [canRender, endIndex, startIndex]);

  return (
    <>
      <Absolute
        p="2%"
        zIndex={1}
        borderRadius="8px"
        bg="white"
        right="2%"
        top="2%"
        boxShadow="0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)">
        <Text>{`indexes: ${startIndex} -> ${endIndex}`}</Text>
        <Button onClick={scrollTo}>Scroll To: {`${HALFWAY}-${totalSize}`}</Button>
      </Absolute>
      <Relative
        ref={container}
        style={{ WebkitOverflowScrolling: 'touch' }}
        height="100vh"
        width={1}
        maxHeight="100vh"
        style={{ willChange: 'transform' }}
        overflow="scroll">
        <Box position="absolute" left={0} top={0} minHeight={`${totalSize}px`} width={1}>
          {items}
        </Box>
      </Relative>
    </>
  );
}

export default withCoreProviders(Index);
