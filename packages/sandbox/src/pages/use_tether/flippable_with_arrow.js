import React, { useRef, useEffect } from 'react';

import useTether, {
  useTetheredTransform,
  useAlignment,
  arrowable,
  flippableWithArrow,
} from '@jwdinker/use-tether';
import useBoundaries from '@jwdinker/use-boundaries';

import styled from 'styled-components';
import { withCoreProviders } from '../../hocs';

const Page = styled.div`
  height: 100vh;
  width: 100vw;
`;

const Scroller = styled.div`
  height: 100%;
  width: 100%;
  overflow: scroll;
  background: #f8f9f9;
`;

const Container = styled.div`
  height: 300vh;
  width: 300%;
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

const Tooltip = styled.div`
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

const Arrow = styled.div`
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

function Component() {
  // create anchor ref that tooltip and arrow will derive position from.
  const anchorRef = useRef();

  // create arrow and element refs for getting size and original position.
  const arrowRef = useRef();
  const toolTipRef = useRef();

  // create boundaries to constrain tetherables
  const boundaryRef = useRef();
  const boundaries = useBoundaries(boundaryRef);

  // put tetherable refs into an array
  const elements = [arrowRef, toolTipRef];

  // track alignment for flipping
  const [alignment, align] = useAlignment('bottom');

  // compute size and positions for tetherables and anchor
  const [tetherables, anchor] = useTether(anchorRef, elements, alignment);

  // adjust positions of tetherables for arrow rotation
  const measurementsAdjustedForArrow = arrowable(tetherables, anchor);

  // get next alignment based on boundaries
  const nextAlignment = flippableWithArrow({
    tetherables: measurementsAdjustedForArrow,
    anchor,
    boundaries,
    at: {
      bottom: ['top', 'left', 'right'], // at bottom boundary flip top, left, right
      top: ['bottom'], // at top boundary, flip bottom
    },
    preference: 'bottom',
  });

  useEffect(() => {
    // if alignment changes update it.
    align(nextAlignment);
  }, [align, nextAlignment]);

  useTetheredTransform(elements, measurementsAdjustedForArrow);

  return (
    <Page>
      <Arrow ref={arrowRef} />
      <Tooltip ref={toolTipRef}>item 2</Tooltip>

      <Scroller>
        <Container ref={boundaryRef}>
          <Anchor ref={anchorRef}>anchor</Anchor>
        </Container>
      </Scroller>
    </Page>
  );
}

const Example = withCoreProviders(Component);
Example.displayName = 'TetherExample';
export default Example;
