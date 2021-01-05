import * as React from 'react';

import { useSprings, animated } from 'react-spring';

import useTether, { getTransform, arrowable } from '@jwdinker/use-tether';

import styled from 'styled-components';

import { withCoreProviders } from '../../../hocs';

const Page = styled.div`
  height: 100vh;
  width: 100vw;
`;

const ScrollingContainer = styled.div`
  height: 100%;
  width: 100%;
  overflow: scroll;
  background: #f8f9f9;
`;

const NestedElement = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Anchor = styled.div`
  height: 50px;
  width: 75px;
  box-sizing: border-box;
  border-radius: 8px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
`;

const RandomElement = styled.div`
  height: 100vh;
  width: 100%;
`;

const ItemAnimated = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;

  height: 75px;
  width: 150px;
  box-sizing: border-box;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  background: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: white;
`;

const TriangleAnimated = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 20px 20px 20px;
  border-color: transparent transparent #007bff transparent;
  z-index: 1;
`;

const { useEffect, useRef } = React;

function Component() {
  const anchor = useRef();

  const top = useRef();
  const left = useRef();
  const right = useRef();
  const bottom = useRef();

  const arrowTop = useRef();
  const arrowLeft = useRef();
  const arrowRight = useRef();
  const arrowBottom = useRef();

  const [leftOffsets] = useTether(anchor, [arrowLeft, left], 'left');
  const [topOffsets] = useTether(anchor, [arrowTop, top], 'top');
  const [bottomOffsets] = useTether(anchor, [arrowBottom, bottom], 'bottom');
  const [rightOffsets] = useTether(anchor, [arrowRight, right], 'right');

  const leftAdjustments = arrowable(leftOffsets, 'left');
  const topAdjustments = arrowable(topOffsets, 'top');
  const bottomAdjustments = arrowable(bottomOffsets, 'bottom');
  const rightAdjustments = arrowable(rightOffsets, 'right');

  const offsets = [leftAdjustments, topAdjustments, bottomAdjustments, rightAdjustments];

  const [animation, set] = useSprings(8, (index) => {
    const nestedIndex = index % 2 === 0 ? 0 : 1;
    const halfIndex = Math.floor(index / 2);
    return {
      transform: getTransform(offsets[halfIndex][nestedIndex]),
    };
  });

  useEffect(() => {
    set((index) => {
      const nestedIndex = index % 2 === 0 ? 0 : 1;
      const halfIndex = Math.floor(index / 2);
      return {
        transform: getTransform(offsets[halfIndex][nestedIndex]),
      };
    });
  });

  return (
    <Page>
      <TriangleAnimated ref={arrowLeft} style={animation[0]} />
      <ItemAnimated ref={left} style={animation[1]}>
        left
      </ItemAnimated>

      <TriangleAnimated ref={arrowTop} style={animation[2]} />
      <ItemAnimated ref={top} style={animation[3]}>
        top
      </ItemAnimated>

      <TriangleAnimated ref={arrowBottom} style={animation[4]} />
      <ItemAnimated ref={bottom} style={animation[5]}>
        bottom
      </ItemAnimated>

      <TriangleAnimated ref={arrowRight} style={animation[6]} />
      <ItemAnimated ref={right} style={animation[7]}>
        right
      </ItemAnimated>

      <ScrollingContainer>
        <RandomElement />
        <NestedElement>
          <Anchor ref={anchor}>anchor</Anchor>
        </NestedElement>
        <RandomElement />
      </ScrollingContainer>
    </Page>
  );
}

const TetherExample = withCoreProviders(Component);
TetherExample.displayName = 'TetherExample';
export default TetherExample;
