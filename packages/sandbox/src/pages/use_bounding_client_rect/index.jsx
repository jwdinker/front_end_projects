import * as React from 'react';
import styled from 'styled-components';

import useBoundingClientRect from '@jwdinker/use-bounding-client-rect';
import { withCoreProviders } from '../../hocs';

const Container = styled.div`
  height: 300vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background: #f8f9f9;
`;

const Item = styled.div`
  height: 150px;
  width: 150px;
  box-sizing: border-box;
  border-radius: 8px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  background: white;
`;

const { useRef } = React;

function Component() {
  const ref = useRef();

  const [measurements, update] = useBoundingClientRect(ref);

  console.log('measurements: ', JSON.stringify(measurements, null, 2));

  return (
    <Container ref={ref}>
      <Item ref={ref} />
    </Container>
  );
}

export default withCoreProviders(Component);
