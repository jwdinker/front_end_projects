import React, { useState } from 'react';
import useAnimationFrame from '@jwdinker/use-animation-frame';

function useAnimationFrameExample() {
  const [count, setCount] = useState(0);
  useAnimationFrame({
    onFrame: () => {
      setCount((previousCount) => previousCount + 1);
    },
  });

  return <div>{`Frame Count: ${count}`}</div>;
}

export default useAnimationFrameExample;
