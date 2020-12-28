import React, { useRef } from 'react';

import useSwipe from '@jwdinker/use-swipe';
import { useSpring, animated } from 'react-spring';
import { withCoreProviders } from '../../hocs';

function Component() {
  const ref = useRef();

  const [
    {
      move: [moveX],
      phase,
    },
    snapTo,
  ] = useSwipe(ref, {
    wheel: true,
    touch: 1,
  });

  const [animation, set] = useSpring(() => {
    return {
      border: '1px solid black',
      transform: `translate3d(0px,0px,0)`,
    };
  });

  if (phase === 'end') {
    snapTo({ x: 0 });
  }

  set(() => ({
    border: '1px solid black',
    transform: `translate3d(${moveX * -1}px,0px,0)`,
  }));

  return (
    <div ref={ref} id="swipe_container" style={{ overflow: 'hidden' }}>
      <animated.div style={animation}>Move Me</animated.div>
    </div>
  );
}

const Page = withCoreProviders(Component);

export default Page;
