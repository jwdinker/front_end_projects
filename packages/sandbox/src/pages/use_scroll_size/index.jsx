import React, { useRef } from 'react';

import styled from 'styled-components';
import useScrollSize from '@jwdinker/use-scroll-size';

import { withCoreProviders } from '../../hocs';
import { dummyImages } from '../../dummy_data';

const Container = styled.div`
  height: 100vh;
  width: 100%;
  overflow: scroll;
`;

const Component = () => {
  const ref = useRef();

  const [dimensions, changed] = useScrollSize(ref, 1000);

  console.log('STATE:', JSON.stringify({ dimensions, changed }, null, 2));

  return (
    <Container ref={ref}>
      {dummyImages.map(({ key, image }) => {
        return <img key={key} src={image} />;
      })}
    </Container>
  );
};

export default withCoreProviders(Component);
