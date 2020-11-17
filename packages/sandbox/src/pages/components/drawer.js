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

import { withCoreProviders } from '../../hocs';

function Drawer({ location, isOpen, children, onClickOutside }) {
  const wasOpen = usePrevious(isOpen);

  const isOpening = !wasOpen && isOpen;
  const isClosing = wasOpen && !isOpen;

  const [animation, set] = useSpring(() => {
    return {
      transform: `translate3d(-100%,0,0)`,
    };
  }, []);

  useEffect(() => {}, []);

  useEffect(() => {
    if (isOpening) {
      set(() => ({ transform: `translate3d(0%, 0, 0)` }));
    }
    if (isClosing) {
      set(() => ({ transform: `translate3d(-100%, 0, 0)` }));
    }
  }, [isClosing, isOpening, set]);

  return (
    <>
      <animated.div
        style={{ position: 'fixed', top: 0, left: 0, height: '100%', zIndex: 1, ...animation }}>
        {children}
      </animated.div>
      {isOpen ? (
        <div
          onClick={onClickOutside}
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
        />
      ) : null}
    </>
  );
}

function Index() {
  const element = useRef();
  const buttonRef = useRef();
  const [isOpen, { toggle, deactivate }] = useToggle(false);

  return (
    <Box height="100vh" width="100vw" bg="black">
      <Absolute right={0}>
        <Button onClick={toggle}>
          <Text color="white">{isOpen ? 'Close' : 'Open'}</Text>
        </Button>
      </Absolute>
      <Drawer isOpen={isOpen} onClickOutside={deactivate}>
        <Box width="30vw" height="100%" bg="white">
          hey
        </Box>
      </Drawer>
    </Box>
  );
}

const Page = withCoreProviders(Index);

Page.displayName = 'Dropdown';
export default Page;
