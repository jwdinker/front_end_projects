import * as React from 'react';

import { getOffsets } from './helpers';
import { UseOffsetsReturn, UseOffsetsElement } from './types';

export { UseOffsetsElement } from './types';

export { Offsets } from './types';

const { useState, useCallback, useEffect } = React;

export const INITIAL_OFFSETS = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  height: 0,
  width: 0,
};

function useOffsets(element: UseOffsetsElement): UseOffsetsReturn {
  const [offsets, setOffsets] = useState(() => {
    return INITIAL_OFFSETS;
  });

  const getElement = useCallback(() => {
    return element && 'current' in element && element.current instanceof HTMLElement
      ? element.current
      : element instanceof HTMLElement
      ? element
      : null;
  }, [element]);

  const remeasure = useCallback(() => {
    const _element = getElement();

    if (_element) {
      const nextOffsets = getOffsets(_element);
      setOffsets(nextOffsets);
    }
  }, [getElement]);

  useEffect(() => {
    if (getElement()) {
      remeasure();
    }
  }, [element, getElement, remeasure]);

  return [offsets, remeasure];
}

export default useOffsets;
