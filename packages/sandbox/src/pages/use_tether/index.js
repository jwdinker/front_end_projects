import React, { useRef, useLayoutEffect, useMemo, useEffect } from 'react';

import useTether, { useTetheredTransform, useAlignment, modify } from '@jwdinker/use-tether';
import useBoundaries from '@jwdinker/use-boundaries';

import styled from 'styled-components';
import { withCoreProviders } from '../../hocs';

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

const RandomElement = styled.div`
  height: 100vh;
  width: 100%;
`;

const Item1 = styled.div`
  height: 150px;
  width: 150px;
  box-sizing: border-box;
  border-radius: 8px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  background: #00a1ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
`;

const Item2 = styled(Item1)`
  width: 300px;
  background: #ffe43a;
`;

function Component() {
  const anchor = useRef();

  const item1 = useRef();
  const item2 = useRef();

  const tetherables = [item1, item2];

  const [measurements] = useTether(anchor, tetherables, 'bottom');

  useTetheredTransform(tetherables, measurements);

  return (
    <Page>
      <Item1 ref={item1}>item 1</Item1>
      <Item2 ref={item2}>item 2</Item2>

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
