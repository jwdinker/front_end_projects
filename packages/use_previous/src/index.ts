import * as React from 'react';

const { useRef, useEffect } = React;

function usePrevious<T>(value: T): T {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

export default usePrevious;
