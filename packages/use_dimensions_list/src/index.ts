import * as React from 'react';

import useElementReferencesChange, {
  ElementOrReference,
  ReferenceCallback,
  getElementOrReference,
} from '@jwdinker/use-element-references-change';

import { Dimensions, UseDimensionsListReturn } from './types';
import { handleMatchingReferenceIndex, getDimensions } from './helpers';

export { ElementOrReference, getElementOrReference } from '@jwdinker/use-element-references-change';

export const INITIAL_DIMENSIONS = {
  height: 0,
  width: 0,
};

export * from './types';

const { useState, useRef, useEffect, useCallback } = React;

function useDimensionsList(elementReferences: ElementOrReference[]): UseDimensionsListReturn {
  /**
   * The initial state is an array of height and width values set to 0.
   */
  const [state, setState] = useState<Dimensions[]>(() => {
    return elementReferences.map(() => INITIAL_DIMENSIONS);
  });

  // Elements are saved in ref to prevent rerenders just in case remeasure is
  // used in useEffect
  const savedElements = useRef(elementReferences);

  useEffect(() => {
    savedElements.current = elementReferences;
  });

  /**
   *
   * @param referencedElements an array of arrays [[index_1, HTMLElement], ...]
   * of recently referenced HTML elements.
   *
   * - onReference is called when a ref.current prop goes from undefined to
   *   HTMLElement or null to HTMLElement.  This allows refs to be toggled.
   * - handleMatchingReferenceIndex updates the dimensions for the matching
   *   index.
   * - If that particular index does not match then the previous dimensions at
   *   that index are returned.
   */
  const onReference: ReferenceCallback = (referencedElements) => {
    setState((previousState) =>
      handleMatchingReferenceIndex(previousState, referencedElements, getDimensions)
    );
  };

  /**
   *
   * @param removedReferences an array of arrays [[index_1, HTMLElement], ...]
   * of previously referenced elements that are now null.
   *
   * - handleMatchingReferenceIndex sets any index that matches a removed
   *   reference index back to the initial dimensions.
   */
  const onDereference: ReferenceCallback = (removedReferences) => {
    setState((previousState) =>
      handleMatchingReferenceIndex(previousState, removedReferences, () => INITIAL_DIMENSIONS)
    );
  };

  /**
   * useElementReferencesChange watches for ref.current values that change from:
   *
   * - undefined -> HTMLElement
   * - null -> HTMLElement
   *
   * Note: the function inside this hook runs on every effect in order to check
   * previous references against current references.
   */
  useElementReferencesChange(elementReferences, { onReference, onDereference });

  /**
   * @param atIndex the index at which the dimensions should be remeasured.  If
   * an index is not provided, all the dimensions that have a coresponding
   * element will be measured.
   */
  const remeasure = useCallback((atIndex = -1) => {
    return setState((previousState) => {
      return previousState.map((dimensions, index) => {
        const element = getElementOrReference(savedElements.current[index]);
        if (element) {
          if (index === -1 || (index > -1 && index === atIndex)) {
            return getDimensions(element);
          }
        }
        return dimensions;
      });
    });
  }, []);

  return [state, remeasure];
}

export default useDimensionsList;
