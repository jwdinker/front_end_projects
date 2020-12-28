import React, { useRef, useMemo, createElement, useEffect, useCallback, memo } from 'react';
import { Box, Centered, Text, Absolute, Relative, Button } from '@jwdinker/styled-system';
import useMeasurementsIndexer from '@jwdinker/use-measurements-indexer';
import upTo from '@jwdinker/up-to';
import { useSpring, animated } from 'react-spring';
import useWindowSize from '@jwdinker/use-window-size';
import { useKineticScroll } from '@jwdinker/use-kinetic-scroll';

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

const MyComponent = ({ style, index }) => {
  return (
    <Box style={style}>
      <Centered width={1} height="100%">
        <Text fontSizeFluid={['25px', '75px']}>{index}</Text>
      </Centered>
    </Box>
  );
};

const MemoizedComponent = memo(MyComponent, () => true);

function Index() {
  const container = useRef();
  const cachedProps = useRef({});

  const [_window, hasSizeChanged] = useWindowSize();

  const [scroll, { scrollTo }] = useKineticScroll(container, { wheel: true });

  const getSize = (index) => {
    return randomIntFromInterval(100, 800);
  };

  const saveProps = useCallback((index, { size, offset }) => {
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
  }, []);

  const { clear, getIndexRangeFromOffsets, getMeasurements } = useMeasurementsIndexer({
    itemSize: 100,
    onMeasure: saveProps,
    log: true,
    infinite: true,
  });

  const canRender = _window.height !== 0;

  const [x, y] = scroll.xy;

  const scrollOffset = y;
  const indexes = canRender
    ? getIndexRangeFromOffsets(scrollOffset, scrollOffset + _window.height)
    : [0, 0];

  console.log('INDEXES: ', indexes);
  const [startIndex, endIndex] = indexes;

  const items = useMemo(() => {
    if (!canRender) {
      return [];
    }
    return upTo(startIndex, endIndex, (index) => {
      return createElement(MemoizedComponent, cachedProps.current[index]);
    });
  }, [canRender, endIndex, startIndex]);

  const [animation, set] = useSpring(() => ({
    height: '100%',
    width: '100%',
    transform: 'translate3d(0,0px,0)',
  }));

  useEffect(() => {
    set(() => {
      return { height: '100%', width: '100%', transform: `translate3d(0,${-y}px,0)` };
    });
  }, [set, y]);

  return (
    <>
      <Button
        onClick={() => {
          const { offset } = getMeasurements(-300);
          scrollTo(0, offset);
        }}>
        click me
      </Button>
      <Absolute
        p="2%"
        zIndex={1}
        borderRadius="8px"
        bg="white"
        right="2%"
        top="2%"
        boxShadow="0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)">
        <Text>{`indexes: ${startIndex} -> ${endIndex}`}</Text>
      </Absolute>
      <Relative ref={container} height="100vh" width={1} maxHeight="100vh" overflow="scroll">
        <animated.div style={animation}>{items}</animated.div>
      </Relative>
    </>
  );
}

export default withCoreProviders(Index);
