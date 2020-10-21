import * as React from 'react';

import getElement, { ElementOrReference } from '@jwdinker/get-element-or-reference';
import {
  haveOffsetsChanged,
  getElementOffsets,
  OFFSET_TYPES,
  Offsets,
  OffsetType,
} from '@jwdinker/offset-helpers';

export { ElementOrReference } from '@jwdinker/get-element-or-reference';

const { useState, useCallback, useEffect } = React;

export const INITIAL_OFFSETS = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  height: 0,
  width: 0,
};

export interface OffsetHandlers {
  measure(): void;
  reset(): void;
}

export type UseOffsetsReturn = [Offsets, OffsetHandlers];
export { Offsets, OFFSET_TYPES } from '@jwdinker/offset-helpers';

function useOffsets(
  element: ElementOrReference,
  type: OffsetType = OFFSET_TYPES.RELATIVE
): UseOffsetsReturn {
  const [offsets, setOffsets] = useState(() => {
    return INITIAL_OFFSETS;
  });

  const destructuredElement = getElement(element);

  const measure = useCallback(() => {
    if (destructuredElement) {
      const nextOffsets = getElementOffsets(destructuredElement, type);
      setOffsets((previousOffsets) => {
        return haveOffsetsChanged(previousOffsets, nextOffsets) ? nextOffsets : previousOffsets;
      });
    }
  }, [destructuredElement, type]);

  const reset = useCallback(() => {
    setOffsets(INITIAL_OFFSETS);
  }, []);

  useEffect(() => {
    measure();
  }, [measure]);

  const handlers = {
    measure,
    reset,
  };

  return [offsets, handlers];
}

export default useOffsets;
