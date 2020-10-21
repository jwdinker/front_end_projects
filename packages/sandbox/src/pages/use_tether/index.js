import React, { forwardRef, useRef, useEffect, useMemo } from 'react';
import { Box, Triangle, Button, Centered, Text, Flex } from '@jwdinker/styled-system';
import useToggle from '@jwdinker/use-toggle';
import useTether, { flippable, useAlignment } from '@jwdinker/use-tether';
import { useSpring, animated, useTransition } from 'react-spring';
import usePortal from '@jwdinker/use-portal';
import useBoundaries from '@jwdinker/use-boundaries';
import { withCoreProviders } from '../../hocs';

const Menu = ({ children, anchor }) => {
  const element = useRef();

  const [Portal, { open, close, isOpen }] = usePortal();

  const [alignment, align] = useAlignment();
  const [dropdown, anchorMeasurements] = useTether(anchor, [element], alignment);

  const [animation, set] = useSpring(() => {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      transform: 'translate3d(0px,0px,0px)',
      opacity: 1,
    };
  }, []);

  const boundaries = useBoundaries(anchor, true);

  const flipTo = flippable(anchorMeasurements, boundaries, {
    tethered: dropdown,
    preference: 'bottom',
  });

  useEffect(() => {
    open();
  }, [open]);

  const { top, left } = dropdown[0];

  useEffect(() => {
    set(() => {
      return {
        position: 'absolute',
        top: 0,
        left: 0,
        transform: `translate3d(${left}px,${top}px,0px)`,
        opacity: 1,
      };
    }, []);
  }, [top, left, set]);

  return useMemo(
    () => (
      <>
        <animated.div style={animation}>
          <Box
            ref={element}
            borderRadius="4px"
            m="0px"
            p={3}
            height="200"
            width="300px"
            as="ul"
            bg="gray.1"
            boxShadow="0px 5px 15px rgba(54, 64, 70, 0.05), 0px 1px 3px rgba(16, 16, 16, 0.1)">
            {children}
          </Box>
        </animated.div>
      </>
    ),
    [animation, children]
  );
};

function Index() {
  const anchor = useRef();

  return (
    <Box height="100vh">
      <Box maxHeight="100vh" overflow="scroll" width={1} bg="black">
        <Centered height="3000px" width={1}>
          <Box
            p={3}
            zIndex={999}
            position="relative"
            aria-haspopup="true"
            role="menu"
            borderRadius="10px"
            border="1px solid"
            borderColor="white"
            ref={anchor}>
            <Text fontWeight="bold" color="white">
              Anchor
            </Text>
          </Box>
        </Centered>
      </Box>

      <Menu anchor={anchor}>
        <Text style={{ WebkitTransform: 'translateZ(0)' }} fontSize="20px">
          Tethered Element
        </Text>
      </Menu>
    </Box>
  );
}

const TetherExample = withCoreProviders(Index);
TetherExample.displayName = 'TetherExample';
export default TetherExample;
