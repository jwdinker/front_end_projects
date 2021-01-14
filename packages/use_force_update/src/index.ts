import * as React from 'react';

const { useState, useCallback, useRef, useEffect } = React;

export type ForceUpdate = () => void;
export type ForceUpdateReturn = [ForceUpdate, boolean];

function useForceUpdate(): ForceUpdateReturn {
  const [count, setCount] = useState(0);
  const previousCount = useRef(0);

  const force = useCallback((): void => {
    setCount((previous) => previous + 1);
  }, []);

  useEffect(() => {
    previousCount.current = count;
  }, [count]);

  return [force, previousCount.current !== count];
}

export default useForceUpdate;
