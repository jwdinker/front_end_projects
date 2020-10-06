import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { Box, Row, Text, Centered, Fixed, Absolute, Relative } from '@jwdinker/styled-system';
import useCoordinates from '@jwdinker/use-coordinates';
import { useSpring, animated } from 'react-spring';
import useEventListener from '@jwdinker/use-event-listener';
import useToggle from '@jwdinker/use-toggle';
import useRotation from '@jwdinker/use-rotation';
import useWindowSize from '@jwdinker/use-window-size';
import useScalable from '@jwdinker/use-scale';
import { withCoreProviders } from '../../hocs';

const Contents = () => {
  const boundary = useRef();
  const element = useRef();
  const [active, { activate, deactivate }] = useToggle();

  const [coordinates, handlers] = useCoordinates();

  const listeners = useRef([]);

  const [{ height }] = useWindowSize();

  console.log('\n\nCOORDINATES: ', JSON.stringify(coordinates, null, 2), '\n\n');

  const {
    distance: [x, y],
    origin,
    move,
    end,
  } = coordinates;

  const [{ transform }, set] = useSpring(() => {
    return { transform: `translate3d(0px,0px,0px)` };
  });

  const toggle = useCallback((type = 'attach') => {
    if (listeners.current) {
      listeners.current.forEach((listener) => listener[type]());
    }
  }, []);

  const _start = useCallback(
    (event) => {
      const { pageX, pageY } = event;
      toggle();
      activate();
      handlers.start(pageX, pageY);
    },
    [activate, handlers, toggle]
  );

  const _move = useCallback(
    (event) => {
      const { pageX, pageY } = event;

      handlers.move(pageX, pageY);
    },
    [handlers]
  );

  const _end = useCallback(
    (event) => {
      const { pageX, pageY } = event;
      toggle('detach');
      deactivate();
      handlers.end();
    },
    [deactivate, handlers, toggle]
  );

  const _window = typeof window !== 'undefined' ? window : null;

  const mousedown = useEventListener(element, 'mousedown', _start);
  const mousemove = useEventListener(_window, 'mousemove', _move);
  const mouseup = useEventListener(_window, 'mouseup', _end);

  console.log('COME ON: ');

  useEffect(() => {
    listeners.current = [mouseup, mousemove];
  }, [mousemove, mouseup]);

  useEffect(() => {
    mousedown.attach();

    return mousedown.detach;
  }, [mousedown]);

  useEffect(() => {
    set(() => {
      return {
        transform: `translate3d(${x}px,${y}px,0px)`,
      };
    });
  }, [set, x, y]);

  // useEffect(() => {
  //   document.addEventListener('gesturestart', (e) => {
  //     e.preventDefault();
  //   });
  // }, []);

  return useMemo(() => {
    return (
      <Absolute height="100vh" maxHeight="100vh" width="100vw" overflow="hidden">
        <Centered height="100%" width="100%">
          <animated.div
            ref={element}
            style={{
              position: 'relative',
              transform,
              background: 'yellow',
              width: '200px',
              height: '200px',
            }}>
            <Absolute width="100%" height="50%" top={0} left={0} borderBottom="1px solid" />
            <Absolute width="50%" height="100%" left="50%" borderLeft="1px solid" />
          </animated.div>
        </Centered>
      </Absolute>
    );
  }, [transform]);
};

export default withCoreProviders(Contents);
