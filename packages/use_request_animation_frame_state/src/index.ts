import { useRef, useCallback, useState, useEffect, Dispatch, SetStateAction } from 'react';

function useRequestAnimationFrameState<S>(
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>] {
  const id = useRef<number | null>(null);
  const [state, setState] = useState(initialState);

  const setRequestAnimationFrameState = useCallback((nextState: S | ((prevState: S) => S)) => {
    if (id.current) {
      window.cancelAnimationFrame(id.current);
    }
    id.current = window.requestAnimationFrame(() => {
      setState(nextState);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (id.current) {
        cancelAnimationFrame(id.current);
        id.current = null;
      }
    };
  }, []);

  return [state, setRequestAnimationFrameState];
}

export default useRequestAnimationFrameState;
