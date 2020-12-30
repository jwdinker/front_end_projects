import React, { useRef } from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';

import useSwipe, { CONTAINER_STYLE, TRANSLATOR_BASE_STYLE } from '@jwdinker/use-swipe';
import upTo from '@jwdinker/up-to';
import { withCoreProviders } from '../../hocs';

const HEIGHT_OF_ITEM = 200;

const Item = styled.div`
  position: absolute;
  height: ${HEIGHT_OF_ITEM}px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  font-weight: bold;
`;

function roundToMultiple(multiple, digit) {
  if (digit > 0) return Math.ceil(digit / multiple) * multiple;
  if (digit < 0) return Math.floor(digit / multiple) * multiple;
  return multiple;
}

const Items = ({ startIndex, endIndex }) => {
  return upTo(startIndex, endIndex, (key) => {
    return (
      <Item style={{ top: `${key * HEIGHT_OF_ITEM}px` }} key={key}>
        {key}
      </Item>
    );
  });
};

const MemoizedItems = React.memo(
  Items,
  (previous, current) =>
    previous.startIndex === current.startIndex && previous.endIndex === current.endIndex
);

function SnapExample() {
  const ref = useRef();

  const options = {
    wheel: true,
    touch: true,
  };

  const [state, snapTo] = useSwipe(ref, options);

  const { phase, xy } = state;

  const y = xy[1];

  const [animation, set] = useSpring(() => {
    return {
      ...TRANSLATOR_BASE_STYLE,
      transform: `translate3d(0,0px,0)`,
    };
  });

  const index = roundToMultiple(HEIGHT_OF_ITEM, y) / HEIGHT_OF_ITEM;

  if (phase === 'end') {
    snapTo({ y: index * HEIGHT_OF_ITEM });
  }

  set(() => ({
    ...TRANSLATOR_BASE_STYLE,
    transform: `translate3d(0,${y * -1}px,0)`,
  }));

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <div ref={ref} style={CONTAINER_STYLE}>
        <animated.div style={animation}>
          <MemoizedItems startIndex={index - 10} endIndex={index + 10} />
        </animated.div>
      </div>
    </div>
  );
}

const Page = withCoreProviders(SnapExample);

export default Page;
