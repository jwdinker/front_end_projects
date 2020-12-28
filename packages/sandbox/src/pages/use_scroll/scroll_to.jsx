import * as React from 'react';
import upTo from '@jwdinker/up-to';
import styled from 'styled-components';
import { useScroll, EASING_TYPES } from '@jwdinker/use-scroll';
import { withCoreProviders } from '../../hocs';

const { useRef, useCallback } = React;

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

const Button = styled.button`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 30px;
  background: #45baff;
  color: #004c78;
  padding: 10px 6px;
  border: none;
  border-radius: 8px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`;

function Items() {
  return upTo(0, 30, (key) => <Item key={key}>{key}</Item>);
}

const Contents = () => {
  const ref = useRef();
  const [scroll, scrollTo] = useScroll(ref);

  const slowScrollTo1000px = useCallback(() => {
    scrollTo({ y: 1000, duration: 5000, easing: EASING_TYPES.EASE_IN_OUT_QUAD });
  }, [scrollTo]);

  return (
    <>
      <Button onClick={slowScrollTo1000px}>Slow Scroll to 1000px</Button>
      <Container ref={ref}>
        <Items />
      </Container>
    </>
  );
};

export default withCoreProviders(Contents);
