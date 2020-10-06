import React, { useRef, useEffect, useLayoutEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Row,
  Text,
  Centered,
  Fixed,
  Absolute,
  Relative,
  box,
  Flex,
} from '@jwdinker/styled-system';
import useRotation from '@jwdinker/use-rotation';
import { useSpring, animated } from 'react-spring';
import { withCoreProviders } from '../../hocs';

const Contents = () => {
  const element = useRef();

  const rotation = useRotation(element, { mouse: true, touch: 2 });

  const [{ transform }, set] = useSpring(() => {
    return { rotate: `rotate(0deg)` };
  });

  useEffect(() => {
    if (rotation.active) {
      set(() => {
        return {
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

  return useMemo(() => {
    return (
      <Flex height="80vh" width="100%">
        <Absolute p={3}>
          {Object.keys(rotation).map((key) => {
            const value = rotation[key];
            if (typeof value === 'string' || !isNaN(value)) {
              return <Box key={key}>{`${key}: ${value}`}</Box>;
            }
            if (Array.isArray(value)) {
              return (
                <Box key={key}>{`${key}:[${value.reduce((accum, val, index) => {
                  const seperator = index === value.length - 1 ? '' : ', ';
                  return accum + val + seperator;
                }, '')}]`}</Box>
              );
            }
            return null;
          })}
        </Absolute>

        <Centered height="100%" width="100%">
          <animated.div
            ref={element}
            style={{
              userSelect: 'none',
              transform,
              background: 'yellow',
              width: '200px',
              height: '200px',
            }}
          />
        </Centered>
      </Flex>
    );
  }, [rotation, transform]);
};

export default withCoreProviders(Contents);
