import React, { forwardRef, useRef, useEffect, useLayoutEffect } from 'react';
import {
  Box,
  Triangle,
  Button,
  Centered,
  Text,
  Flex,
  Row,
  Absolute,
  Fixed,
  Ratio,
  Relative,
  Column,
} from '@jwdinker/styled-system';
import useToggle from '@jwdinker/use-toggle';
import useTether, {
  useAlignment,
  arrowable,
  flippable,
  flippableWithArrow,
  preventableOverflow,
  preventableOverflowWithArrow,
} from '@jwdinker/use-tether';
import { useSprings, animated, useTransition } from 'react-spring';
import usePortal from '@jwdinker/use-portal';
import preventOverflow from '@jwdinker/prevent-overflow';
import useBoundaries from '@jwdinker/use-boundaries';
import useWindowSize from '@jwdinker/use-window-size';
import styled from 'styled-components';
import { withCoreProviders } from '../../hocs';

const MyArrow = styled.div`
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 10px 80px 10px;
  border-color: transparent transparent #007bff transparent;
`;

const Tetherable = (props) => {
  const { children, anchorRefererence, alignment, isFlippable, setAlignment } = props;
  const popoverReference = useRef();
  const arrowReference = useRef();

  const [tetherables, anchor] = useTether(
    anchorRefererence,
    [arrowReference, popoverReference],
    alignment
  );

  const styles = arrowable(tetherables, alignment);

  const [boundaries] = useWindowSize();

  const replacementAlignment = isFlippable
    ? flippableWithArrow(anchor, boundaries, {
        tethered: tetherables,
        preference: 'bottom',
      })
    : alignment;

  const preventedOverflow = preventableOverflowWithArrow(styles, boundaries, alignment);

  const { current } = arrowReference;
  useEffect(() => {}, [current]);

  useEffect(() => {
    setAlignment(replacementAlignment);
  }, [replacementAlignment, setAlignment]);

  const [animations, set, stop] = useSprings(2, (index) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    transform: 'translate3d(0px,0px,0px) rotate(0deg)',
    opacity: 1,
    zIndex: index === 0 ? 999 : 0,
  }));

  useLayoutEffect(() => {
    set((index) => {
      const { top, left, rotate } = preventedOverflow[index];
      return {
        position: 'fixed',
        top: 0,
        left: 0,
        transform: `translate3d(${left}px,${top}px,0px) rotate(${index === 0 ? rotate : 0}deg)`,
        opacity: 1,
        zIndex: index === 0 ? 999 : 0,
      };
    });
  }, [boundaries, preventedOverflow, set, styles, tetherables]);

  const [arrowAnimation, popoverAnimation] = animations;
  return (
    <>
      <animated.div ref={arrowReference} style={arrowAnimation}>
        {children[0]}
      </animated.div>

      <animated.div ref={popoverReference} style={popoverAnimation}>
        {children[1]}
      </animated.div>
    </>
  );
};

function Toolbar({ setAlignment, toggleFlippable }) {
  return (
    <Fixed width="100%">
      <Row>
        <Row width="100%" flex={2} p={1}>
          <Box width={1} height="100%">
            <Ratio borderRadius="50%" bg="white">
              <Absolute top={0} left={0} height="100%" width={1}>
                <Column width={1} height="100%">
                  <Centered>
                    <Button
                      onClick={() => {
                        setAlignment('top');
                      }}>
                      <Text fontSizeFluid={['10px', '50px']}>▲</Text>
                    </Button>
                  </Centered>
                  <Row>
                    <Row justifyContent="flex-start">
                      <Button
                        onClick={() => {
                          setAlignment('left');
                        }}>
                        <Text fontSizeFluid={['10px', '50px']}>◄</Text>
                      </Button>
                    </Row>
                    <Row justifyContent="flex-end">
                      <Button
                        onClick={() => {
                          setAlignment('right');
                        }}>
                        <Text fontSizeFluid={['10px', '50px']}>►</Text>
                      </Button>
                    </Row>
                  </Row>
                  <Centered>
                    <Button
                      onClick={() => {
                        setAlignment('bottom');
                      }}>
                      <Text fontSizeFluid={['10px', '50px']}>▼</Text>
                    </Button>
                  </Centered>
                </Column>
              </Absolute>
            </Ratio>
          </Box>
        </Row>
        <Row flex={8}>
          <Row>
            <Centered>
              <Button onClick={toggleFlippable}>
                <Text fontSizeFluid={['10px', '50px']}>Toggle Flip</Text>
              </Button>
            </Centered>
          </Row>
        </Row>
      </Row>
    </Fixed>
  );
}

function Index() {
  const anchor = useRef();
  const [canFlip, flippableTogglers] = useToggle(true);
  const [alignment, setAlignment] = useAlignment();

  return (
    <Box bg="black" width="100vw" height="300vh">
      <Toolbar setAlignment={setAlignment} toggleFlippable={flippableTogglers.toggle} />
      <Tetherable
        alignment={alignment}
        isFlippable={canFlip}
        setAlignment={setAlignment}
        anchorRefererence={anchor}>
        <Box minWidth="50px" height="100%">
          <Triangle fill="blue.5" />
          {/* <MyArrow /> */}
        </Box>
        <Box minHeight="100px" bg="white" p={3}>
          Box 1
        </Box>
      </Tetherable>
      <Box height="100vh" width={1}>
        spacer
      </Box>
      {/* <Centered height="3000px" width={1}> */}
      <Button
        ref={anchor}
        p={3}
        bg="white"
        zIndex={999}
        position="relative"
        role="menu"
        borderRadius="10px"
        border="1px solid"
        borderColor="white">
        <Box id="anchor">
          <Text fontWeight="bold" color="white">
            Anchor
          </Text>
        </Box>
      </Button>
      {/* </Centered> */}
    </Box>
  );
}

const TetherExample = withCoreProviders(Index);

export default TetherExample;
