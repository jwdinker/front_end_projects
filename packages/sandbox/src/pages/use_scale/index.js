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
import useScale from '@jwdinker/use-scale';
import { withCoreProviders } from '../../hocs';

const Contents = () => {
  const element = useRef();

  const scale = useScale(element, { mouse: true });

  console.log('SCALE: ', JSON.stringify(scale, null, 2));
  const [x, y, z] = scale.vector;

  const [{ transform }, set] = useSpring(() => {
    return { transform: `scale(1)` };
  });

  useEffect(() => {
    if (scale.isScaling) {
      set(() => {
        return { transform: `scale(${z})` };
      });
    }
  }, [scale.active, scale.isScaling, scale.total, set, x, y, z]);

  useEffect(() => {
    document.addEventListener('gesturestart', (e) => {
      e.preventDefault();
    });
  }, []);

  return useMemo(() => {
    return (
      <Flex height="80vh" width="100%">
        <Centered height="100%" width="100%">
          <animated.div
            ref={element}
            style={{
              position: 'relative',

              transform,
              height: '200px',
              width: `200px`,
              background: 'yellow',
            }}
          />
        </Centered>
      </Flex>
    );
  }, [transform]);
};

export default withCoreProviders(Contents);
