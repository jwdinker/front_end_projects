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
import { useTransition, animated, useSprings, useSpring, useChain, useTrail } from 'react-spring';
import useSSR from '@jwdinker/use-ssr';
import usePrevious from '@jwdinker/use-previous';

import useTether, { useAlignment, flippable, getStyles } from '@jwdinker/use-tether';
import useBoundaries from '@jwdinker/use-boundaries';

import { withCoreProviders } from '../../hocs';

function Dropdown({ anchor, isOpen, children, onClickOutside }) {
  const dropdownRef = useRef();
  const [alignment, align] = useAlignment('bottom');

  const boundaries = useBoundaries();

  const references = [dropdownRef];

  const [measurements, anchorMeasurements] = useTether(anchor, references, alignment);

  const alternativeAlignment = flippable(anchorMeasurements, boundaries, {
    tethered: measurements,
    preference: 'bottom',
  });

  const [animation, set] = useSpring(() => {
    return {
      position: 'fixed',
      top: 0,
      left: 0,
      opacity: 0,
      zIndex: 1,
      transformOrigin: 'top center',
      transform: `translate3d(0px,0px,0) scale(0)`,
    };
  });

  const { left, top } = measurements[0];

  useEffect(() => {
    align(alternativeAlignment);
  }, [alternativeAlignment, align]);

  useEffect(() => {
    const [opacity, scale] = isOpen ? [1, 1] : [0, 0];

    set(() => {
      return {
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1,
        opacity,
        transformOrigin: 'top center',
        transform: `translate3d(${left}px,${top}px,0) scale(${scale})`,
      };
    });
  }, [isOpen, left, set, top]);

  return (
    <>
      <animated.div ref={dropdownRef} style={animation}>
        {children}
      </animated.div>
      {isOpen ? (
        <div
          aria-modal="true"
          tabIndex={-1}
          role="dialog"
          onClick={onClickOutside}
          style={{ position: 'fixed', height: '100vh', width: '100vw', top: 0, left: 0 }}
        />
      ) : null}
    </>
  );
}

function Index() {
  const element = useRef();
  const buttonRef = useRef();
  const [isOpen, { toggle, deactivate }] = useToggle(false);

  console.log('jackDinker'.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase());

  useEffect(() => {
    console.log('IS TRUE: ', document.body instanceof HTMLBodyElement);
  }, []);

  return (
    <Box position="static" height="300vh" width="300vw">
      <Box height="100vh" width={1}>
        <Centered width={1} height="100%">
          <Button ref={buttonRef} onClick={toggle}>
            click me
          </Button>
        </Centered>
      </Box>
      <Centered height="100%" width={1}>
        <Dropdown label="Stuff" anchor={buttonRef} isOpen={isOpen} onClickOutside={deactivate}>
          {/* <Centered width={1}>
            <Box width="30px" key={0}>
              <Triangle fill="blue.5" />
            </Box>
          </Centered> */}
          <Box mx={1} my={1}>
            <Box
              key={1}
              border="1px solid"
              bg="white"
              px={3}
              py={3}
              borderRadius="8px"
              boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)">
              <Box>option 1</Box>
              <Box>option 2</Box>
            </Box>
          </Box>
        </Dropdown>
      </Centered>
    </Box>
  );
}

const Page = withCoreProviders(Index);

Page.displayName = 'Dropdown';
export default Page;
