import * as React from 'react';

import useAncestorScrollListener from '@jwdinker/use-ancestors-scroll-listener';
import { getContainingBlock } from '@jwdinker/get-containing-block';
import useRequestAnimationFrameState from '@jwdinker/use-request-animation-frame-state';
import makeHasChanged from '@jwdinker/make-has-changed';
import { getHTMLElementFromReference } from '@jwdinker/use-dimensions-list';
import { getAnchorMeasurements } from './helpers';
import { UseAnchor } from '../types';

const ABBREVIEATED_RECT_PROPS = ['top', 'left', 'height', 'width'];
const hasChanged = makeHasChanged(ABBREVIEATED_RECT_PROPS);

const { useRef, useEffect, useCallback } = React;

const INITIAL_MEASUREMENTS = { top: 0, left: 0, height: 0, width: 0 };

/*
    useAnchor Breakdown:   

    1. With the assumption that all the tethered elements are at the same depth
       in the DOM tree and won't have different offset parents or containing
       blocks, only the first tethered element's offset parent or containing
       block is saved in the container reference.  

    2. The update function fires once on first render in order to calculate the
       initial size and position of the anchor.

    2. The useAncestorsScrollListener accepts an array of node references and
       finds all the scrollable ancestors of those node references.
        - Once all the ancestors are found for each element reference, a scroll
          listener is added for each element.
        - It's important to note that any duplicate ancestors are removed so the
          elements only share a single scroll listener. This prevents multiple
          calls to the update callback function.

    3.  When the scroll event happens, the anchor measurements are gathered in
        the update function.  The anchor's final position is calculated by:
          - The anchor reference's bounding rectangle measurements are used as a
            starting position since the tethered elements are attached to it.
          - If the container reference is the HTML document that means it's
            position is shared with the anchor reference's bounding rectangle as
            the bounding rectangle is relative to the viewport. Consequently,
            the document scroll x/y coordinates must be subtracted from the
            anchor's x/y coordinates.  
          - Finally, since all tethered elements will either be position fixed
            or absolute with top and left values set to 0, the tethered
            element's container's size and position is retreived with
            getBoundingClientRects and also subtracted from the anchor's top and
            left position.

    4. The last step is comparing the previous measurements against the newly
       calculated measurements.  If the values match the previous measurements
       are returned in order to prevent rerenders.
  */

const useAnchor: UseAnchor = (anchor, elements) => {
  const container = useRef<Element | null>();
  const [state, setState] = useRequestAnimationFrameState(INITIAL_MEASUREMENTS);

  const references = [anchor, ...elements];

  const firstElement = getHTMLElementFromReference(elements[0]);

  const update = useCallback(() => {
    setState((previousMeasurements) => {
      const anchorElement = getHTMLElementFromReference(anchor);

      if (anchorElement && container.current) {
        const measurements = getAnchorMeasurements(anchorElement, container.current);

        return hasChanged(previousMeasurements, measurements) ? measurements : previousMeasurements;
      }
      return previousMeasurements;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (firstElement) {
      container.current = firstElement.offsetParent || getContainingBlock(firstElement);

      return () => {
        container.current = null;
      };
    }
    update();
    return undefined;
  }, [firstElement, update, anchor]);

  useAncestorScrollListener(references, update);

  return [state, update];
};

export default useAnchor;
