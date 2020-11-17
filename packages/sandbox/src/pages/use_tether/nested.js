import React, {
  useEffect,
  useState,
  useRef,
  createContext,
  useContext,
  useMemo,
  Children,
  useCallback,
  forwardRef,
  useLayoutEffect,
} from 'react';
import useWindowSize from '@jwdinker/use-window-size';
import {
  Box,
  Centered,
  Column,
  Text,
  Row,
  Absolute,
  Relative,
  Button,
  Triangle,
} from '@jwdinker/styled-system';
import useBlockScroll from '@jwdinker/use-block-scroll';
import upTo from '@jwdinker/up-to';
import useToggle from '@jwdinker/use-toggle';
import useSize from '@jwdinker/use-size';
import useDrag from '@jwdinker/use-drag';
import { useTransition, animated, useSprings, useSpring, useChain } from 'react-spring';
import useSSR from '@jwdinker/use-ssr';
import usePrevious from '@jwdinker/use-previous';

import useTether, {
  useAlignment,
  arrowable,
  flippableWithArrow,
  getStyles,
  preventableOverflowWithArrow,
} from '@jwdinker/use-tether';

import useBoundaries from '@jwdinker/use-boundaries';
import useForceUpdate from '@jwdinker/use-force-update';
import { withCoreProviders } from '../../hocs';

const { log } = console;

const Popover = ({ anchorReference, children }) => {
  const popoverReference = useRef();
  const arrowReference = useRef();

  const [alignment, align] = useAlignment('bottom');

  const [measurements, anchorMeasurements] = useTether(
    anchorReference,
    [arrowReference, popoverReference],
    alignment
  );
  const boundaries = useBoundaries(anchorReference);
  const withArrowStyles = arrowable(measurements, alignment);
  const withPreventableOverflow = preventableOverflowWithArrow(
    withArrowStyles,
    boundaries,
    alignment
  );
  const alternateAlignment = flippableWithArrow(anchorMeasurements, withArrowStyles, boundaries, {
    preference: 'bottom',
  });

  const [animations, set] = useSprings(2, (index) => {
    const style = getStyles(withPreventableOverflow[index], { position: 'fixed', zIndex: 9999 });
    return style;
  });

  useEffect(() => {
    align(alternateAlignment);
    console.log('%cChanged alignemnt:', 'background:red;', alternateAlignment);
  }, [align, alternateAlignment]);

  // log(
  //   'Measurments: ',
  //   JSON.stringify(
  //     {
  //       item: measurements[0],
  //       anchor: anchorMeasurements,
  //       boundaries,
  //     },
  //     null,
  //     2
  //   ),
  //   '\n\n'
  // );

  useEffect(() => {
    set((index) => {
      const style = getStyles(withPreventableOverflow[index], { position: 'fixed', zIndex: 9999 });

      return style;
    });
  }, [set, withPreventableOverflow]);

  const [arrow, popover] = animations;
  return (
    <>
      <animated.div ref={popoverReference} style={popover}>
        {children[0]}
      </animated.div>

      <animated.div ref={arrowReference} style={arrow}>
        {children[1]}
      </animated.div>
    </>
  );
};

function Index() {
  const anchorReference = useRef();

  const buttonRef = useRef();
  const [isOpen, { toggle }] = useToggle(true);

  return (
    <>
      <Absolute top={0} left={0} zIndex={9999}>
        <Button onClick={toggle}>remove popover</Button>
      </Absolute>
      <Box id="container" height="80vh" width={1} overflow="scroll" bg="black">
        <Box height="250vh" width="250vw">
          <Centered height="100%" width={1}>
            <Box borderRadius="8px" ref={anchorReference} bg="#000000" height="50px" width="100px">
              <Centered height="100%" width={1}>
                <Text textAlign="center" color="white">
                  Anchor
                </Text>
              </Centered>
            </Box>
          </Centered>
        </Box>
      </Box>

      <Box height="600px" width={1} id="spacer" bg="green.1">
        Spacer
      </Box>

      <Box id="container" height="80vh" width={1} overflow="scroll" bg="gray.5">
        <Box height="250vh" width="250vw">
          <Centered height="100%" width={1}>
            OTHER BOX
          </Centered>
        </Box>
      </Box>
      {isOpen ? (
        <Popover anchorReference={anchorReference}>
          <Box borderRadius="8px" bg="white" px={3} py={3}>
            This is the Popover
          </Box>
          <Box width="50px">
            <Triangle fill="white" />
          </Box>
        </Popover>
      ) : null}
    </>
  );
}

const Page = withCoreProviders(Index);

Page.displayName = 'Dropdown';
export default Page;
