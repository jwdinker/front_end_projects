import * as React from 'react';
import styled from 'styled-components';

import useBoundaries from '@jwdinker/use-boundaries';
import useAnimationFrame from '@jwdinker/use-animation-frame';
import { Absolute, Text, Relative } from '@jwdinker/styled-system';
import { withCoreProviders } from '../../hocs';

const Page = styled.div`
  width: 100vw;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 50px;
`;

const Container = styled.div`
  flex:1
  box-sizing: border-box;
  overflow: scroll;
  width:80%;
  background: #f8f9f9;
  border: dotted 3px #00a1ff;
  border-radius:8px;
  max-height:400px;
`;

const LargeItem = styled.div`
  height: 100vh;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SmallItem = styled.div`
  height: 150px;
  width: 150px;
  box-sizing: border-box;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const { useRef, useEffect } = React;

function Component() {
  const ref = useRef();

  const boundaries = useBoundaries(ref);

  return (
    <Page>
      <LargeItem />
      <Relative width="80%">
        <Text fontWeight="bold" color="base">
          boundaries
        </Text>
      </Relative>
      <Relative width="80%">
        <Text color="base">{`top:${boundaries.top}`}</Text>
      </Relative>
      <Relative width="80%">
        <Text color="base">{`left:${boundaries.left}`}</Text>
      </Relative>

      <Container>
        <LargeItem>
          <SmallItem ref={ref}>
            <Text textAlign="center" color="black">
              referenced element
            </Text>
          </SmallItem>
        </LargeItem>
      </Container>
      <LargeItem />
    </Page>
  );
}

export default withCoreProviders(Component);
