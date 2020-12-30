import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import useBlockScroll from '@jwdinker/use-block-scroll';
import upTo from '@jwdinker/up-to';

import { withCoreProviders } from '../../hocs';

const Page = styled.div`
  height: 200vh;
  width: 100vw;
`;

const Container = styled.div`
  height: 50vh;
  width: 100vw;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
`;

const Item = styled.div`
  height: 20%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 30px;
  box-sizing: border-box;
  border: solid 1px black;
`;

const Items = () => upTo(0, 20, (key) => <Item key={key}>{key}</Item>);

function BlockScrollExample() {
  const element = useRef();

  const [enable, disable] = useBlockScroll(element);

  useEffect(() => {
    enable();
    return disable;
  }, [disable, enable]);

  return (
    <Page>
      <Container ref={element}>
        <Items />
      </Container>
    </Page>
  );
}

export default withCoreProviders(BlockScrollExample);
