import * as React from 'react';

import useElementReferencesChange, {
  getHTMLElementFromReference,
  ReferenceCallback,
  HTMLElementReference,
} from '@jwdinker/use-element-references-change';

import { Dimensions, UseDimensionsListReturn } from './types';
import { getDimensions } from './helpers';

export {
  getHTMLElementFromReference,
  HTMLElementReference,
} from '@jwdinker/use-element-references-change';

export const INITIAL_DIMENSIONS = {
  height: 0,
  width: 0,
};

export * from './types';

const { useState, useRef, useEffect, useCallback } = React;

function useDimensionsList(elementReferences: HTMLElementReference[]): UseDimensionsListReturn {
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
    setState((previousState) => {
      return previousState.map((value, index) => {
        const item = referencedElements.find(([i]) => i === index);
        if (item) {
          return getDimensions(item[1]);
        }
        return value;
      });
    });
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
    setState((previousState) => {
      return previousState.map((value, index) => {
        const item = removedReferences.find(([i]) => i === index);
        if (item) {
          return INITIAL_DIMENSIONS;
        }
        return value;
      });
    });
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
  const measureAtIndex = useCallback((atIndex = -1) => {
    return setState((previousState) => {
      return previousState.map((dimensions, index) => {
        const element = getHTMLElementFromReference(savedElements.current[index]);
        if (element) {
          if (index === -1 || (index > -1 && index === atIndex)) {
            return getDimensions(element);
          }
        }
        return dimensions;
      });
    });
  }, []);

  return [state, measureAtIndex];
}

export default useDimensionsList;
