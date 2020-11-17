import * as React from 'react';

import useElementReferencesChange, {
  ElementOrReference,
  ReferenceCallback,
  ChangedElementReferences,
} from '@jwdinker/use-element-references-change';

import {
  OFFSET_TYPES,
  Offsets,
  getElementOffsets as getOffsets,
  OffsetType,
} from '@jwdinker/offset-helpers';

export { Offsets, OffsetType } from '@jwdinker/offset-helpers';

export { ElementOrReference, getElementOrReference } from '@jwdinker/use-element-references-change';

export type Remeasure = () => void;
export type UseOffsetsReturn = [Offsets[], Remeasure];

export const INITIAL_OFFSETS = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  height: 0,
  width: 0,
};

function getOffsetsOfElements(elements: ChangedElementReferences[], type: OffsetType): Offsets[] {
  const offsets: Offsets[] = [];
  for (let i = 0; i < elements.length; i += 1) {
    const [key, element] = elements[i];
    if (element) {
      offsets.push(getOffsets(element, type));
    } else {
      offsets.push(INITIAL_OFFSETS);
    }
  }
  return offsets;
}

const { useState, useCallback } = React;

function useOffsetsList(
  elements: ElementOrReference[],
  type: OffsetType = OFFSET_TYPES.RELATIVE
): UseOffsetsReturn {
  const [offsets, setOffsets] = useState<Offsets[]>(() => {
    return elements.map(() => INITIAL_OFFSETS);
  });

  const onReference: ReferenceCallback = (referencedElements) => {
    setOffsets((previous) => {
      return previous.map((offset, index) => {
        const foundChanged = referencedElements.find(([changedIndex]) => index === changedIndex);
        if (foundChanged) {
          const element = foundChanged[1];
          return getOffsets(element, type);
        }
        return offset;
      });
    });
  };

  const onRemove: ReferenceCallback = (removedReferences) => {
    setOffsets((previous) => {
      return previous.filter((offset, index) => {
        return removedReferences.some(([removeIndex]) => removeIndex === index);
      });
    });
  };

  useElementReferencesChange(elements, { onReference, onRemove });

  // Dependencies are hard coded in order to spread dependencies of elements.
  const remeasure = useCallback(() => {
    // const nextOffsets = getOffsetsOfElements(_savedElements.current, type);
    // console.log('NEXT OFFSETS: ', nextOffsets);
    // setOffsets((previousOffsets) => {
    //   return haveOffsetsChanged(previousOffsets, nextOffsets) ? nextOffsets : previousOffsets;
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [offsets, remeasure];
}

export default useOffsetsList;
