import { useMemo } from 'react';
import useScrollState from './use_scroll_state';

function useScroll(element, { endDelay = 100, passive = false } = {}) {
  const options = useMemo(
    () => ({
      endDelay,
      passive,
    }),
    [endDelay, passive]
  );
  const value = useScrollState(element, options);
  return value;
}

export default useScroll;
