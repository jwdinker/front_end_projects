import React, { forwardRef, useRef, useEffect, useMemo, useCallback, useLayoutEffect } from 'react';
import { Box, Triangle, Button, Centered, Text, Flex } from '@jwdinker/styled-system';
import useTether, { flippable, useAlignment, arrowable, getTransform } from '@jwdinker/use-tether';
import styled from 'styled-components';

import styleObjectToString from '@jwdinker/style-object-to-string';
import { withCoreProviders } from '../../hocs';

const Arrow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 20px 20px 20px;
  border-color: transparent transparent #007bff transparent;
`;

const OverflowContainer = styled.div`
  height: 100%;
  width: 100%;
  overflow: scroll;
`;

const CenterContainer = styled.div`
  height: 300vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TetheredElement = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px;
  background: #007bff;
  color: white;
  border-radius: 8px;
`;

function MyComponent() {
  const anchorReference = useRef();

  const arrowRef = useRef();
  const popoverRef = useRef();

  const [tetheredOffsets, anchorOffsets] = useTether(
    anchorReference,
    [arrowRef, popoverRef],
    'bottom'
  );

  const offsetWithArrow = arrowable(tetheredOffsets, 'bottom');

  useLayoutEffect(() => {
    const refs = [arrowRef, popoverRef];
    refs.forEach((element, index) => {
      const transform = getTransform(tetheredOffsets[index]);
      element.current.style.transform = transform;
    });
  }, [tetheredOffsets]);

  return (
    <div>
      <OverflowContainer>
        <CenterContainer>
          <div ref={anchorReference}>anchor</div>
        </CenterContainer>
      </OverflowContainer>

      <Arrow ref={arrowRef} />

      <TetheredElement ref={popoverRef}>Tethered Element</TetheredElement>
    </div>
  );
}

const TetherExample = withCoreProviders(MyComponent);
TetherExample.displayName = 'TetherExample';
export default TetherExample;
