import React, { useRef, useEffect, useMemo } from 'react';
import { Centered, Flex } from '@jwdinker/styled-system';

import { useSpring, animated } from 'react-spring';
import useScale from '@jwdinker/use-scale';
import { withCoreProviders } from '../../hocs';

const BASE_STYLE = {
  height: '200px',
  width: `200px`,
  borderRadius: '8px',
  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05)',
  background: '#202a37',
};

const Contents = () => {
  const element = useRef();

  const scale = useScale(element, { mouse: true });

  console.log('SCALE STATE: ', JSON.stringify(scale, null, 2));

  const [x, y, z] = scale.vector;

  const [style, set] = useSpring(() => {
    return { transform: `scale(1)`, ...BASE_STYLE };
  });

  useEffect(() => {
    if (scale.isScaling) {
      set(() => {
        return { transform: `scale(${z})`, ...BASE_STYLE };
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
      <Flex height="100vh" width="100%">
        <Centered height="100%" width="100%">
          <animated.div ref={element} style={style} />
        </Centered>
      </Flex>
    );
  }, [style]);
};

export default withCoreProviders(Contents);
