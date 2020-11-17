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
import makeCSSTransformFromObject from '@jwdinker/make-css-transform-from-object';
import { withCoreProviders } from '../../hocs';

const { log } = console;

const getTransform = makeCSSTransformFromObject(['translate3d', 'rotate', 'scaleY']);

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
  const alternateAlignment = flippableWithArrow(anchorMeasurements, withArrowStyles, boundaries);

  const [animations, set] = useSprings(2, (index) => {
    const { left, top, rotate } = withPreventableOverflow[index];
    return {
      position: 'fixed',
      top: 0,
      left: 0,
      transform: getTransform({
        translate3d: `${left}px,${top}px,0`,
        rotate: `${rotate || 0}deg`,
        scaleY: '0',
      }),
    };
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

  useLayoutEffect(() => {
    set((index) => {
      const { left, top, rotate } = withPreventableOverflow[index];
      return {
        position: 'fixed',
        top: 0,
        left: 0,
        transform: getTransform({
          translate3d: `${left}px,${top}px,0`,
          rotate: `${rotate || 0}deg`,
          scaleY: '1',
        }),
      };
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

  useEffect(() => {
    window.scrollTo(window.innerWidth / 2, window.innerHeight / 2);
  }, []);

  return (
    <>
      <Box id="container" height="100vh" width={1}>
        <Box height="300vh" width="100vw" bg="black">
          <Centered height="100%" width={1}>
            <Box borderRadius="8px" ref={anchorReference} bg="#000000" height="50px" width="100px">
              <Centered height="100%" width={1}>
                <Text textAlign="center" color="white">
                  Anchor
                </Text>
              </Centered>
            </Box>
          </Centered>

          <Popover anchorReference={anchorReference}>
            <Box borderRadius="8px" bg="white" px={3} py={3}>
              This is the Popover
            </Box>
            <Box width="50px">
              <Triangle fill="white" />
            </Box>
          </Popover>
        </Box>
      </Box>
    </>
  );
}

const Page = withCoreProviders(Index);

Page.displayName = 'Dropdown';
export default Page;
