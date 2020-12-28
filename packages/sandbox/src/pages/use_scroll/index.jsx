import * as React from 'react';
import upTo from '@jwdinker/up-to';
import styled from 'styled-components';
import { useScroll } from '@jwdinker/use-scroll';
import { withCoreProviders } from '../../hocs';

const { useRef } = React;

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20%;
  width: 100%;
  box-sizing: border-box;
  border: solid 1px black;
  font-weight: bold;
  font-size: 30px;
`;

const Contents = () => {
  const ref = useRef();
  const [scroll, scrollTo] = useScroll(ref);

  console.log('Scroll State: ', JSON.stringify(scroll, null, 2), '\n\n');

  return (
    <Container ref={ref}>
      {upTo(0, 100, (key) => (
        <Item key={key}>{key}</Item>
      ))}
    </Container>
  );
};

export default withCoreProviders(Contents);
