import React, { useRef } from 'react';

import useTether, { useTetheredTransform } from '@jwdinker/use-tether';

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
  const anchorRef = useRef();

  const item1Ref = useRef();
  const item2Ref = useRef();

  const elements = [item1Ref, item2Ref];

  const [measurements] = useTether(anchorRef, elements, 'bottom');

  useTetheredTransform(elements, measurements);

  return (
    <Page>
      <Item1 ref={item1Ref}>item 1</Item1>
      <Item2 ref={item2Ref}>item 2</Item2>

      <Scroller>
        <Container>
          <Anchor ref={anchorRef}>anchor</Anchor>
        </Container>
      </Scroller>
    </Page>
  );
}

const Example = withCoreProviders(Component);
Example.displayName = 'TetherExample';
export default Example;
