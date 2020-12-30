import React, { useEffect, useState } from 'react';
import { Button } from '@jwdinker/styled-system';
import useAnimationFrame from '@jwdinker/use-animation-frame';

function useAnimationFrameExample() {
  const [count, setCount] = useState(0);

  const handleCount = (time, elapsedTime) => {
    setCount((previousCount) => previousCount + 1);
  };

  const [start, stop] = useAnimationFrame(handleCount, 2000);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
      }}>
      <div style={{ fontSize: '50px', fontWeight: 'bold' }}>{`Frame Count: ${count}`}</div>

      <div style={{ display: 'flex' }}>
        <button onClick={start}>start</button>
        <button onClick={stop}>stop</button>
      </div>
    </div>
  );
}

export default useAnimationFrameExample;
