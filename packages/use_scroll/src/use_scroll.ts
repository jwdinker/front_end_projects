import { useMemo } from 'react';
import useScrollState from './use_scroll_state';
import { UseScrollStateReturn, ScrollElement } from './types';

function useScroll(
  element: ScrollElement = null,
  { endDelay = 100, passive = false } = {}
): UseScrollStateReturn {
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
