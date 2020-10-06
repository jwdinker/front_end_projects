import React, { useRef, useMemo, createElement, useEffect } from 'react';
import { Box, Centered, Text, Absolute, Relative } from '@jwdinker/styled-system';
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
        <Text fontSizeFluid={['25px', '75px']}>{index + 1}</Text>
      </Centered>
    </Box>
  );
};

function Index() {
  const container = useRef();
  const cachedProps = useRef({});

  const [_window, hasSizeChanged] = useWindowSize();

  const [scroll] = useKineticScroll(container, { wheel: true });

  const getSize = (index) => {
    return randomIntFromInterval(100, 800);
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

  const [x, y] = scroll.xy;
  const indexes = canRender
    ? getIndexRangeFromOffsets(y - _window.height, y + _window.height * 2)
    : [0, 0];

  const [startIndex, endIndex] = indexes;

  const items = useMemo(() => {
    if (!canRender) {
      return [];
    }
    return upTo(startIndex, endIndex, (index) => {
      return createElement(MyComponent, cachedProps.current[index]);
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
