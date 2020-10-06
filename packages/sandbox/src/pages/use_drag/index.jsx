import React, { useRef, useEffect, useMemo } from 'react';
import { Box, Centered, Absolute } from '@jwdinker/styled-system';
import useDrag from '@jwdinker/use-drag';
import { useSpring, animated } from 'react-spring';

import usePreventOverflow from '@jwdinker/use-prevent-overflow';

import useEventListener from '@jwdinker/use-event-listener';
import { withCoreProviders } from '../../hocs';

const Contents = () => {
  const element = useRef();

  const state = useDrag(element);

  console.log('useDrag State: ', JSON.stringify(state, null, 2), '\n\n');

  const {
    xy: [x, y],
    direction,
  } = state;

  const [{ transform }, set] = useSpring(() => {
    return { transform: `translate3d(0px,0px,0px)` };
  });

  const [ox, oy] = usePreventOverflow(
    { top: y, left: x },
    { top: -100, left: -100, bottom: 100, right: 100 },
    { sides: ['top', 'left', 'right'] }
  );

  useEffect(() => {
    set(() => {
      return {
        transform: `translate3d(${x}px,${y}px,0px)`,
      };
    });
  }, [ox, oy, set, x, y]);

  // console.log('STATE: ', JSON.stringify(state, null, 2));
  useEffect(() => {
    document.addEventListener('gesturestart', (e) => {
      e.preventDefault();
    });
  }, []);

  return useMemo(() => {
    return (
      <Box height="100vh" width="100%">
        <Centered height="100%" width="100%">
          <Box width="60%" height="60%" bg="yellow.4">
            <animated.div
              ref={element}
              style={{
                position: 'relative',
                transform,
                background: 'yellow',
                width: '200px',
                height: '200px',
              }}>
              <Absolute
                bg="blue.5"
                height="10px"
                width="10px"
                top="50%"
                left="50%"
                borderRadius="10%"
              />
            </animated.div>
          </Box>
        </Centered>
      </Box>
    );
  }, [transform]);
};

export default withCoreProviders(Contents);
