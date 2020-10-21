import React, {
  useEffect,
  useState,
  useRef,
  createContext,
  useContext,
  useMemo,
  Children,
  useCallback,
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
import { useTransition, animated, useSpring } from 'react-spring';
import useSSR from '@jwdinker/use-ssr';

import usePopover, { useAlignment } from '@jwdinker/use-popover';
import useFlip from '@jwdinker/use-flip';
import useBoundaries from '@jwdinker/use-boundaries';
import { withCoreProviders } from '../../hocs';

const getTransform = ({ top, left, rotate }) => {
  let transform = `translate3d(${left}px,${top}px,0px)`;
  if (typeof rotate !== 'undefined') {
    transform += ` rotate(${rotate}deg)`;
  }

  return transform;
};

const getStyle = (isOpen, measurements) => {
  return {
    position: 'fixed',
    top: 0,
    left: 0,
    transform: getTransform(measurements),
  };
};

function DropDown({ label, children }) {
  const anchorReference = useRef();
  const popoverReference = useRef();
  const arrowReference = useRef();
  const [isOpen, { toggle }] = useToggle();

  const boundaries = useBoundaries();

  const [alignment, align] = useAlignment();

  const [measurements, { watch, unwatch }] = usePopover({
    anchor: anchorReference,
    popover: popoverReference,
    arrow: arrowReference,
    alignment,
  });

  const [dropdown, setDropdown] = useSpring(() => {
    return {
      position: 'fixed',
      top: 0,
      left: 0,
      transform: `translate3d(0px,0px,0px)`,
    };
  });

  const [arrow, setArrow] = useSpring(() => {
    return {
      position: 'fixed',
      top: 0,
      left: 0,
      transform: `translate3d(0px,0px,0px) rotate(0deg)`,
    };
  });

  //   const replacementAlignment = useFlip(measurements.anchor, boundaries, {
  //     preference: 'bottom',
  //     tethered: [measurements.popover, measurements.arrow],
  //   });

  useEffect(() => {
    watch();
    return unwatch;
  }, [unwatch, watch]);

  //   useEffect(() => {
  //     align[replacementAlignment]();
  //   }, [align, replacementAlignment]);

  //   const transitions = useTransition(active, null, {
  //     from: {
  //       ...measurements.popover,
  //       position: 'fixed',
  //       opacity: 0,
  //       transform: 'scaleY(0)',
  //       transformOrigin: 'top center',
  //     },
  //     enter: {
  //       ...measurements.popover,
  //       position: 'fixed',
  //       opacity: 1,
  //       transform: 'scaleY(1)',
  //       transformOrigin: 'top center',
  //     },
  //     leave: {
  //       ...measurements.popover,
  //       position: 'fixed',
  //       opacity: 0,
  //       transform: 'scaleY(0)',
  //       transformOrigin: 'top center',
  //     },
  //   });

  useEffect(() => {
    if (isOpen) {
      setDropdown(() => getStyle(isOpen, measurements.popover));
      setArrow(() => getStyle(isOpen, measurements.arrow));
    }
  }, [
    isOpen,
    measurements.anchor.top,
    measurements.arrow,
    measurements.popover,
    setArrow,
    setDropdown,
  ]);

  const numberOfChildren = Children.count(children);
  const isDropDownOnly = numberOfChildren === 1;
  const hasArrow = numberOfChildren === 2;
  const hasTooManyChildren = numberOfChildren > 2;

  const getChildren = useCallback(() => {
    if (numberOfChildren === 1) {
      return (
        <animated.div ref={popoverReference} style={dropdown}>
          {children}
        </animated.div>
      );
    }
    if (numberOfChildren === 2) {
      return (
        <>
          <animated.div ref={arrowReference} style={arrow}>
            {children[0]}
          </animated.div>
          <animated.div id="FUCK" ref={popoverReference} style={dropdown}>
            {children[1]}
          </animated.div>
        </>
      );
    }

    throw new Error('DropDown component cannot have more than 2 children.');
  }, [arrow, children, dropdown, numberOfChildren]);

  return useMemo(() => {
    return (
      <>
        <Button ref={anchorReference} onClick={toggle}>
          {label}
        </Button>

        <animated.div style={dropdown}>
          <Box ref={popoverReference}>{children}</Box>
        </animated.div>
      </>
    );
  }, [arrow, children, dropdown, label, numberOfChildren, toggle]);
}

function Index() {
  const element = useRef();

  return (
    <Box height="300vh" width={1}>
      <Centered height="100%" width={1}>
        <DropDown label="Stuff">
          <Box width="30px">
            <Triangle fill="blue.5" />
          </Box>
          <Box
            border="1px solid"
            bg="white"
            px={3}
            py={3}
            borderRadius="8px"
            boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)">
            <Box>option 1</Box>
            <Box>option 2</Box>
          </Box>
        </DropDown>
      </Centered>
    </Box>
  );
}

const Page = withCoreProviders(Index);

Page.displayName = 'Dropdown';
export default Page;
