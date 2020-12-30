import * as React from 'react';
import styled from 'styled-components';
import useAncestorsScrollListener from '@jwdinker/use-ancestors-scroll-listener';
import { withCoreProviders } from '../../hocs';

const { useRef, useState } = React;

const Container = styled.div`
  height: 50vh;
  width: 100vw;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
`;

const WindowItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80vh;
  width: 100%;
  box-sizing: border-box;
  border: solid 1px black;
  font-weight: bold;
  font-size: 30px;
`;

const ContainerItem = styled.div`
  height: 300vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 30px;
`;

const Display = styled.button`
  position: fixed;
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

const Contents = () => {
  const [id, setId] = useState('none');
  const childWithHTMLScrollingParent = useRef();
  const childOfWindowScroll = useRef();

  const handler = (event) => {
    const nextId = event.target.id ? event.target.id : 'window';
    setId((previous) => (previous !== nextId ? nextId : previous));
  };

  useAncestorsScrollListener([childWithHTMLScrollingParent, childOfWindowScroll], handler);

  return (
    <>
      <Display>{`Scrolling: ${id}`}</Display>
      <WindowItem ref={childOfWindowScroll}>window is my scroll parent</WindowItem>
      <Container id="container" ref={childWithHTMLScrollingParent}>
        <ContainerItem ref={childWithHTMLScrollingParent}>
          container is my scroll parent
        </ContainerItem>
      </Container>
    </>
  );
};

export default withCoreProviders(Contents);
