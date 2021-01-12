import * as React from 'react';

import useElementReferencesChange, {
  HTMLElementReference,
  ReferenceCallback,
  getHTMLElementFromReference,
} from '@jwdinker/use-element-references-change';

import {
  OFFSET_TYPES,
  Offsets,
  getElementOffsets as getOffsets,
  OffsetType,
} from '@jwdinker/offset-helpers';

export { Offsets, OffsetType } from '@jwdinker/offset-helpers';

export {
  HTMLElementReference,
  getHTMLElementFromReference,
} from '@jwdinker/use-element-references-change';

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

const { useState, useCallback, useRef, useEffect } = React;

function useOffsetsList(
  elements: HTMLElementReference[],
  type: OffsetType = OFFSET_TYPES.RELATIVE
): UseOffsetsReturn {
  const [offsets, setOffsets] = useState<Offsets[]>(() => {
    return elements.map(() => INITIAL_OFFSETS);
  });

  const savedElements = useRef(elements);

  useEffect(() => {
    savedElements.current = elements;
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

  const onDereference: ReferenceCallback = (removedReferences) => {
    setOffsets((previous) => {
      return previous.filter((offset, index) => {
        return removedReferences.some(([removeIndex]) => removeIndex === index);
      });
    });
  };

  useElementReferencesChange(elements, { onReference, onDereference });

  // Dependencies are hard coded in order to spread dependencies of elements.
  const remeasure = useCallback(
    (atIndex = -1) => {
      return setOffsets((previousState) => {
        return previousState.map((dimensions, index) => {
          const element = getHTMLElementFromReference(savedElements.current[index]);
          if (element) {
            if (index === -1 || (index > -1 && index === atIndex)) {
              return getOffsets(element, type);
            }
          }
          return dimensions;
        });
      });
    },
    [type]
  );

  return [offsets, remeasure];
}

export default useOffsetsList;
