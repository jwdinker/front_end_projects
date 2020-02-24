import { useState, useCallback, useEffect } from 'react';
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
  const [offsets, setOffsets] = useState(() => {
    return INITIAL_OFFSETS;
  });

  const remeasure = useCallback(() => {
    const nextOffsets = getOffsets(element.current);
    setOffsets(nextOffsets);
  }, [element]);

  useEffect(() => {
    if (element && element.current) {
      remeasure();
    }
  }, [element, remeasure]);

  return [offsets, remeasure];
}

export default useOffsets;
