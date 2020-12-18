import React, { useRef, useEffect, useMemo } from 'react';
import { Centered, Flex, Box, Row, Text, Absolute } from '@jwdinker/styled-system';

import { useSpring, animated } from 'react-spring';
import useScale from '@jwdinker/use-scale';
import useSize from '@jwdinker/use-size';
import { withCoreProviders } from '../../hocs';

const HEIGHT = 200;
const WIDTH = 200;

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
      <Text fontSize="18px" fontWeight="bold" color="white">{`${name}:`}</Text>
      <Text style={{ color }} fontSize="18px" fontWeight="bold">{`${value}`}</Text>
    </Row>
  );
};

function Details({ size, isResizing }) {
  return (
    <Absolute zIndex={1} top={0} left={0} width={1 / 3}>
      <Centered p={3}>
        <Box>
          <KeyValue key={isResizing} name="isResizing" value={isResizing} />
          {Object.keys(size).map((property) => {
            const value = size[property];
            return (
              <KeyValue
                key={property}
                name={property}
                value={typeof value === 'number' ? Math.round(value) : value}
              />
            );
          })}
        </Box>
      </Centered>
    </Absolute>
  );
}

const Contents = () => {
  const element = useRef();

  const scale = useScale(element, { mouse: true, initialScale: [1, 1, 1] });
  const [size, isResizing] = useSize(element);

  const [x, y, z] = scale.vector;

  //! useSpring has fast refresh bug. styles are lost after refresh if using height or width
  const [style, set] = useSpring(() => {
    return { background: 'white', height: `${HEIGHT * y}px`, width: `${WIDTH * x}px` };
  });

  useEffect(() => {
    if (scale.isScaling) {
      set(() => {
        return { background: 'white', height: `${HEIGHT * y}px`, width: `${WIDTH * x}px` };
      });
    }
  }, [scale.isScaling, set, x, y]);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
    };
    document.addEventListener('gesturestart', handler);
    return () => {
      document.removeEventListener('gesturestart', handler);
    };
  }, []);

  return (
    <>
      <Details isResizing={isResizing} size={size} />

      <Flex bg="black" height="100vh" width="100%">
        <Centered height="100%" width="100%">
          <animated.div ref={element} style={style} />
        </Centered>
      </Flex>
    </>
  );
};

const Page = withCoreProviders(Contents);
export default Page;
