import * as React from 'react';

const { useRef, useEffect } = React;

function useRefCallback<T>(callback: T) {
  const saved = useRef<T>(callback);

  useEffect(() => {
    saved.current = callback;
    return () => {
      // @ts-ignore
      saved.current = null;
    };
  }, [callback]);

  return saved;
}

export default useRefCallback;
