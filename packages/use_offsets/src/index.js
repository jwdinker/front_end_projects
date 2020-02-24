import { useState, useCallback, useEffect, useRef } from 'react';
import { getOffsets } from './helpers';

export const INITIAL_OFFSETS = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  height: 0,
  width: 0,
};

function useOffsets(element) {
  const measured = useRef(false);
  const [offsets, setOffsets] = useState(() => {
    return INITIAL_OFFSETS;
  });

  const remeasure = useCallback(() => {
    const nextOffsets = getOffsets(element.current);
    setOffsets(nextOffsets);
  }, [element]);

  // Initial Measurement on first render
  useEffect(() => {
    if (!measured.current && element.current) {
      remeasure();
      measured.current = true;
    }
  }, [element, remeasure]);

  return [offsets, remeasure];
}

export default useOffsets;
