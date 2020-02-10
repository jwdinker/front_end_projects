import React, { useState, useRef, useEffect, useMemo, forwardRef, useLayoutEffect } from 'react';
import { Box, Row, Text, Centered, Fixed, Absolute, Relative, box } from '@jwdinker/styled-system';

import usePopover, {
  usePreventOverflow,
  useFlipable,
  useHideable,
  convertTransformToString,
  DEFAULT_STYLES,
} from '@jwdinker/use-popover';

import { useSprings, animated, useSpring } from 'react-spring';
import styled from 'styled-components';
import { withCoreProviders } from '../../hocs';

const AnimatedBox = styled(animated.div)`
  ${box}
  position:absolute;
`;

const Triangle = styled(animated.div)`
  z-index: 0;
  position: absolute;
  top:0;
  left:0,
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 20px 40px 20px;
  border-color: transparent transparent blue transparent;
`;

const SVGTriangle = () => {
  return (
    <svg width="40" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.66 1.317c1.137-1.756 3.543-1.756 4.68 0l14.513 22.398c1.326 2.045-.03 4.856-2.34 4.856H5.487c-2.312 0-3.667-2.81-2.341-4.856L17.659 1.317z"
        fill="#000"
      />
      <path d="M5 20.855l35 7.716H0l5-7.716z" fill="#000" />
      <path d="M35 20.855L0 28.57h40l-5-7.716z" fill="#000" />
    </svg>
  );
};

const MyPopover = forwardRef(({ children }, element) => {
  const popover = useRef();
  const triangle = useRef();

  const args = useMemo(() => {
    return {
      popover,
      triangle,
      element,
    };
  }, [element]);

  const props = usePopover(args);

  // useFlipable(props);
  usePreventOverflow(props, { flipArrow: true });
  // const { seen } = useHideable(props);

  const [popoverAnimation, setPopoverAnimation] = useSpring((index) => {
    return { ...DEFAULT_STYLES.POPOVER };
  });

  const [triangleAnimation, setTriangleAnimation] = useSpring((index) => {
    return { ...DEFAULT_STYLES.TRIANGLE };
  });

  // useLayoutEffect(() => {
  //   props.applyStyles(props.styles);
  // }, [props]);

  useEffect(() => {
    const { styles } = props;

    setPopoverAnimation(() => {
      const { transform, ...restOfStyles } = styles.popover;
      return {
        ...restOfStyles,
        transform: convertTransformToString(transform),
      };
    });

    setTriangleAnimation(() => {
      const { transform, ...restOfStyles } = styles.triangle;
      return {
        ...restOfStyles,
        transform: convertTransformToString(transform),
      };
    });
  }, [props, setPopoverAnimation, setTriangleAnimation]);

  return useMemo(() => {
    return (
      <>
        <Triangle ref={triangle} style={triangleAnimation} />
        <AnimatedBox
          style={popoverAnimation}
          top={0}
          left={0}
          ref={popover}
          bg="white"
          borderRadius="8px"
          boxShadow="0px 5px 15px rgba(0, 0, 0, 0.05), 0px 1px 3px rgba(0, 0, 0, 0.1)"
          height="100px"
          width="100px">
          <Centered width={1} height="100%">
            <Text>Popover</Text>
          </Centered>
        </AnimatedBox>
      </>
    );
  }, [popoverAnimation, triangleAnimation]);
});

const Contents = () => {
  const element = useRef();

  return useMemo(
    () => (
      <>
        <Box height="100%" width={1} style={{ WebkitOverflowScrolling: 'touch' }}>
          <Box bg="white" height="3000px" width="3000px">
            <Centered height="100%" width={1}>
              {console.log('RENDERING')}
              <Box
                ref={element}
                bg="blue.5"
                borderRadius="8px"
                boxShadow="0px 5px 15px rgba(0, 0, 0, 0.05), 0px 1px 3px rgba(0, 0, 0, 0.1)"
                height="200px"
                width="200px">
                <Centered position="relative" width={1} height="100%">
                  <Absolute
                    zIndex={1}
                    height="40px"
                    width="20px"
                    right="-20px"
                    top="50%"
                    style={{ transform: 'translate3d(0,-50%,0)' }}
                    border="solid 1px"
                    borderColor="blue.5"
                  />
                  <Absolute
                    height="440px"
                    width="440px"
                    left="-120px"
                    top="-120px"
                    border="solid 1px"
                    borderColor="blue.5"
                  />
                  <Absolute
                    height="100px"
                    width="100px"
                    top="-120px"
                    right="50px"
                    border="solid 1px"
                    borderColor="blue.5"
                  />
                  <Absolute height="100%" width="50%" left="50%" border="solid 1px" />
                  <Absolute height="50%" width="100%" top="50%" border="solid 1px" />
                  <Text>Pilot</Text>
                </Centered>
              </Box>
            </Centered>
          </Box>
        </Box>
        <MyPopover ref={element} />
      </>
    ),
    []
  );
};

export default withCoreProviders(Contents);
