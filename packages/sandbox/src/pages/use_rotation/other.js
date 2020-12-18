import React, { useRef, useEffect } from 'react';
import { Centered, Flex, Row, Absolute, Text, Box } from '@jwdinker/styled-system';

import { useSpring, animated } from 'react-spring';
import useRotation from '@jwdinker/use-rotation';
import { withCoreProviders } from '../../hocs';

const BASE_STYLE = {
  height: '200px',
  width: `200px`,
  borderRadius: '8px',
  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05)',
  background: 'white',
};

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

function Details({ rotate, children, ...rotation }) {
  return (
    <Absolute zIndex={1} top={0} left={0} width={1 / 3}>
      <Centered p={3}>
        <Box>
          {Object.keys(rotation).map((property) => {
            const value = rotation[property];

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

  const rotation = useRotation(element, { mouse: true, touch: 2 });

  const [style, set] = useSpring(() => {
    return { transform: `rotate(0deg) `, ...BASE_STYLE };
  });

  useEffect(() => {
    if (rotation.active) {
      set(() => {
        return {
          ...BASE_STYLE,
          transform: `rotate(${rotation.angle}deg)`,
        };
      });
    }
  }, [rotation, rotation.total, set]);

  useEffect(() => {
    document.addEventListener('gesturestart', (e) => {
      e.preventDefault();
    });
  }, []);

  return (
    <>
      <Details {...rotation} />
      <Flex bg="black" height="100vh" width="100%">
        <Centered height="100%" width="100%">
          <animated.div ref={element} style={style} />
        </Centered>
      </Flex>
    </>
  );
};

export default withCoreProviders(Contents);
