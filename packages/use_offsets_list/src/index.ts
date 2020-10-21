import * as React from 'react';

import getElement, { ElementOrReference } from '@jwdinker/get-element-or-reference';

import {
  OFFSET_TYPES,
  haveOffsetsChanged,
  Offsets,
  getElementOffsets as getOffsets,
  OffsetType,
} from '@jwdinker/offset-helpers';

import { INITIAL_OFFSETS } from './constants';

export { Offsets, OffsetType } from '@jwdinker/offset-helpers';
export { ElementOrReference } from '@jwdinker/get-element-or-reference';

export type Remeasure = () => void;
export type UseOffsetsReturn = [Offsets[], Remeasure];

function getOffsetsOfElements(elements: ElementOrReference[], type: OffsetType): Offsets[] {
  const offsets: Offsets[] = [];
  for (let i = 0; i < elements.length; i += 1) {
    const element = getElement(elements[i]);
    if (element) {
      offsets.push(getOffsets(element, type));
    } else {
      offsets.push(INITIAL_OFFSETS);
    }
  }
  return offsets;
}

const { useState, useCallback, useEffect } = React;

function useOffsetsList(
  elements: ElementOrReference[],
  type: OffsetType = OFFSET_TYPES.RELATIVE
): UseOffsetsReturn {
  const [offsets, setOffsets] = useState(() => {
    return elements.map(() => INITIAL_OFFSETS);
  });

  // Dependencies are hard coded in order to spread dependencies of elements.
  const remeasure = useCallback(() => {
    const nextOffsets = getOffsetsOfElements(elements, type);
    setOffsets((previousOffsets) => {
      return haveOffsetsChanged(previousOffsets, nextOffsets) ? nextOffsets : previousOffsets;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...elements]);

  useEffect(() => {
    remeasure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...elements, remeasure]);

  return [offsets, remeasure];
}

export default useOffsetsList;
