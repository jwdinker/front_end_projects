import * as React from 'react';

import {
  haveOffsetsChanged,
  getElementOffsets,
  OFFSET_TYPES,
  Offsets,
  OffsetType,
} from '@jwdinker/offset-helpers';

import getHTMLElementFromReference, {
  HTMLElementReference,
} from '@jwdinker/get-html-element-from-reference';

const { useState, useCallback, useEffect } = React;

export const INITIAL_OFFSETS = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  height: 0,
  width: 0,
};

export type MeasureOffsets = () => void;

export type UseOffsetsReturn = [Offsets, MeasureOffsets];
export { Offsets, OFFSET_TYPES } from '@jwdinker/offset-helpers';

function useOffsets(
  element: HTMLElementReference,
  type: OffsetType = OFFSET_TYPES.RELATIVE
): UseOffsetsReturn {
  const [offsets, setOffsets] = useState(() => {
    return INITIAL_OFFSETS;
  });

  const measure = useCallback(() => {
    const _element = getHTMLElementFromReference(element);
    if (_element) {
      const nextOffsets = getElementOffsets(_element, type);
      setOffsets((previousOffsets) => {
        return haveOffsetsChanged(previousOffsets, nextOffsets) ? nextOffsets : previousOffsets;
      });
    }
  }, [element, type]);

  useEffect(() => {
    measure();
  }, [measure]);

  return [offsets, measure];
}

export default useOffsets;
