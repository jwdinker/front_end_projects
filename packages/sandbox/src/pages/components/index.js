import React, { useEffect, useState, useRef, createContext, useContext, useMemo } from 'react';
import useWindowSize from '@jwdinker/use-window-size';
import { Box, Centered, Column, Text, Row, Absolute, Relative } from '@jwdinker/styled-system';
import useBlockScroll from '@jwdinker/use-block-scroll';
import upTo from '@jwdinker/up-to';
import useToggle from '@jwdinker/use-toggle';
import useSize from '@jwdinker/use-size';
import useDrag from '@jwdinker/use-drag';
import { useSpring, animated } from 'react-spring';
import useSSR from '@jwdinker/use-ssr';
import { withCoreProviders } from '../../hocs';

const ResizableSideMenuContext = createContext();

const RESIZE_MENU_DEFAULT_STYLE = {
  padding: 0,
  margin: 0,
  height: '100%',
  border: 'solid 1px black',
};
function ResizableSideMenu({
  children,
  min = 175,
  max = 400,
  defaultSize = 220,
  resizeFrom = 'right',
}) {
  const container = useRef();
  const resizer = useRef();
  const [measurements] = useSize(container);
  const {
    active,
    xy: [x],
  } = useDrag(resizer);

  const { isBrowser } = useSSR();

  const isLeft = resizeFrom === 'right';
  const operator = isLeft ? 1 : -1;
  const size = Math.max(
    min,
    Math.min(defaultSize / measurements.width + defaultSize + x * operator, max)
  );
  const userSelect = active ? 'none' : 'auto';

  const [animation, set] = useSpring(() => {
    return {
      ...RESIZE_MENU_DEFAULT_STYLE,
      width: `${defaultSize}px`,
      userSelect,
    };
  });

  useEffect(() => {
    set(() => ({
      ...RESIZE_MENU_DEFAULT_STYLE,
      width: `${size}px`,
      userSelect,
    }));
  }, [set, size, userSelect]);

  return (
    <animated.div ref={container} style={animation}>
      <Relative height="100%" width={1}>
        <Absolute
          ref={resizer}
          width="2%"
          height="100%"
          left={isLeft ? 'auto' : '-1%'}
          right={isLeft ? '-1%' : 'auto'}
          style={{ cursor: 'ew-resize' }}
        />

        <ResizableSideMenuContext.Provider value={{ measurements, isResizing: active }}>
          {children}
        </ResizableSideMenuContext.Provider>
      </Relative>
    </animated.div>
  );
}

function Option({ children }) {
  const { measurements } = useContext(ResizableSideMenuContext);

  return <Box>{children}</Box>;
}

function Full({ children }) {
  return (
    <Box height="100vh" width={1}>
      {children}
    </Box>
  );
}

const Menu = {
  Side: ResizableSideMenu,
  Option,
};

const Page = {
  Full,
};

function PageResizeExample() {
  const element = useRef();

  //   const [block, restore] = useBlockScroll(element);
  const [{ height, width }] = useWindowSize();

  //   useEffect(() => {
  //     block();
  //     return restore;
  //   }, [block, restore]);

  return (
    <Page.Full>
      <Box height="-webkit-fill-available" width={1}>
        <Absolute right={0} height="100%">
          <Menu.Side resizeFrom="left">
            <Menu.Option>this is a very long menu option</Menu.Option>
          </Menu.Side>
        </Absolute>
      </Box>
    </Page.Full>
  );
}

export default withCoreProviders(PageResizeExample);
