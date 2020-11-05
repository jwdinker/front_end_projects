import * as React from 'react';

import useAncestorScrollListener from '@jwdinker/use-ancestors-scroll-listener';
import { getContainingBlock } from '@jwdinker/get-containing-block';
import useRequestAnimationFrameState from '@jwdinker/use-request-animation-frame-state';
import makeHasChanged from '@jwdinker/make-has-changed';
import { ElementOrReference, getElementOrReference } from '@jwdinker/use-offsets-list';
import { getAnchorMeasurements } from './helpers';

const ABBREVIEATED_RECT_PROPS = ['top', 'left', 'height', 'width'];
const hasChanged = makeHasChanged(ABBREVIEATED_RECT_PROPS);

const { useRef, useEffect, useCallback } = React;

const INITIAL_MEASUREMENTS = { top: 0, left: 0, height: 0, width: 0 };

function useAnchor(anchor: ElementOrReference, elements: ElementOrReference[]) {
  const ancestor = useRef<HTMLElement>();
  const [state, setState] = useRequestAnimationFrameState(INITIAL_MEASUREMENTS);

  const references = [anchor, ...elements];

  const firstElement = getElementOrReference(elements[0]);

  const update = useCallback(() => {
    const _anchor = getElementOrReference(anchor);
    const _ancestor = getElementOrReference(ancestor);
    if (_anchor && _ancestor) {
      setState((previousMeasurements) => {
        const measurements = getAnchorMeasurements(_anchor, _ancestor);
        return hasChanged(previousMeasurements, measurements) ? measurements : previousMeasurements;
      });
    }
  }, [anchor]);

  useEffect(() => {
    if (firstElement) {
      ancestor.current = getContainingBlock(firstElement);
      update();
    }
  }, [firstElement, update]);

  useAncestorScrollListener(references, update);

  return state;
}

export default useAnchor;
