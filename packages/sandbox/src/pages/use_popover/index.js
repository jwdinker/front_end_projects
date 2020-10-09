import React, { forwardRef, useRef, useEffect, useMemo } from 'react';
import { Box, Triangle, Button, Centered, Text, Flex } from '@jwdinker/styled-system';
import useToggle from '@jwdinker/use-toggle';
import useTether from '@jwdinker/use-tether';
import { useSpring, animated, useSprings } from 'react-spring';
import usePortal from '@jwdinker/use-portal';
import usePopover, { useAlignment } from '@jwdinker/use-popover';
import useBoundaries from '@jwdinker/use-boundaries';
import useFlip from '@jwdinker/use-flip';
import preventOverflow from '@jwdinker/prevent-overflow';
import { withCoreProviders } from '../../hocs';

const Menu = forwardRef(({ children, container, alignment, align }, anchorRef) => {
  const elementRef = useRef();
  const arrowRef = useRef();

  const [Portal, { open, close, isOpen }] = usePortal();

  const boundaries = useBoundaries(anchorRef);

  const [{ popover, arrow, padding, anchor }, { watch, unwatch }] = usePopover({
    anchor: anchorRef,
    popover: elementRef,
    arrow: arrowRef,
    alignment,
  });

  // const [pox, poy] = usePreventOverflow(popover, boundaries, {
  //   padding: padding.popover,
  // });

  // const [aox, aoy] = usePreventOverflow(arrow, boundaries, { padding: padding.arrow });

  const [arrowPreventOverflow] = preventOverflow({
    element: arrow,
    boundaries,
    padding: padding.arrow,
  });

  const [popoverOverflowPrevented] = preventOverflow({
    element: popover,
    boundaries,
    padding: padding.popover,
  });

  const replacement = useFlip(anchor, boundaries, {
    preference: 'bottom',
    tethered: [popover, arrow],
  });

  useEffect(() => {
    watch();
    return () => {
      unwatch();
    };
  }, [unwatch, watch]);

  const [animation, set] = useSprings(
    2,
    (index) => {
      return {
        position: 'absolute',
        top: 0,
        left: 0,
        transform: 'translate3d(0px,0px,0px) rotate(0deg)',
        opacity: 1,
        zIndex: index === 0 ? 0 : 1,
      };
    },
    []
  );

  useEffect(() => {
    open();
  }, [open]);

  useEffect(() => {
    set((index) => {
      const { top, left } = index === 0 ? popoverOverflowPrevented : arrowPreventOverflow;
      return {
        position: 'absolute',
        top: 0,
        left: 0,
        transform: `translate3d(${left}px,${top}px,0px) rotate(${
          index === 1 ? arrow.rotate : 0
        }deg)`,
        opacity: 1,
        zIndex: index === 0 ? 0 : 1,
      };
    }, []);
  }, [
    arrow.left,
    arrow.rotate,
    arrow.top,
    arrowPreventOverflow,
    popover.left,
    popover.top,
    popoverOverflowPrevented,
    set,
  ]);

  useEffect(() => {
    align[replacement]();
  }, [align, replacement]);

  const [popoverAnimation, triangleAnimation] = animation;

  return useMemo(
    () => (
      <>
        <Portal>
          <animated.div style={triangleAnimation}>
            <Box ref={arrowRef} width="30px" maxWidth="30px">
              <Triangle fill="gray.1" />
            </Box>
          </animated.div>
          <animated.div style={popoverAnimation}>
            <Box
              ref={elementRef}
              borderRadius="4px"
              m="0px"
              p={3}
              height="100px"
              width="100px"
              as="ul"
              bg="gray.1"
              boxShadow="0px 5px 15px rgba(54, 64, 70, 0.05), 0px 1px 3px rgba(16, 16, 16, 0.1)">
              {children}
            </Box>
          </animated.div>
        </Portal>
      </>
    ),
    [children, popoverAnimation, triangleAnimation]
  );
});

function Index() {
  const anchor = useRef();

  const [alignment, align] = useAlignment();
  const [active, { activate, deactivate }] = useToggle();
  return (
    <>
      <Box height="100vh" />
      <Box maxHeight="700px" overflow="scroll" width={1} bg="black">
        <Centered height="3000px" width={1}>
          <Button
            zIndex={999}
            position="relative"
            aria-haspopup="true"
            role="menu"
            onClick={activate}
            ref={anchor}>
            click me
          </Button>
        </Centered>
      </Box>
      <Box>
        <Button onClick={align.top}>top</Button>
        <Button onClick={align.bottom}>bottom</Button>
        <Button onClick={align.left}>left</Button>
        <Button onClick={align.right}>right</Button>
      </Box>
      <Menu ref={anchor} align={align} alignment={alignment}>
        <Text style={{ WebkitTransform: 'translateZ(0)' }} fontSize="20px">
          item 1
        </Text>
        <Text>item 2</Text>
      </Menu>
      <Box height="100vh" />
    </>
  );
}

export default withCoreProviders(Index);
