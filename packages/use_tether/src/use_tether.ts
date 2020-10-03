import { useCallback } from 'react';
import useBoundingClientRect from '@jwdinker/use-bounding-client-rect';
import useDimensions from '@jwdinker/use-dimensions';
import { Alignment, UseTetherReturnValue, Anchor, AbbreviatedRectangle } from './types';

import { coordinateFromPosition } from './helpers';
import { DEFAULT_ANCHOR_MEASUEMENTS, ALIGNMENTS_TYPES, ALIGNMENTS_KEYS } from './constants';

function useTether(
  anchor: Anchor = DEFAULT_ANCHOR_MEASUEMENTS,
  element: React.RefObject<HTMLElement | undefined> | null,
  alignment: Alignment = ALIGNMENTS_TYPES.bottom
): UseTetherReturnValue {
  const anchorReference = anchor && 'current' in anchor ? anchor : null;
  const [_anchor, watchAnchor, unwatchAnchor] = useBoundingClientRect(anchorReference, {
    addPageOffsets: true,
  });

  const [dimensions, watchDimensions, unwatchDimensions] = useDimensions(element);

  const coordinates = anchorReference ? _anchor : (anchor as AbbreviatedRectangle);

  const [x, y] = ALIGNMENTS_KEYS[alignment];

  const top = coordinateFromPosition[y](coordinates, dimensions);
  const left = coordinateFromPosition[x](coordinates, dimensions);

  const watch = useCallback(() => {
    watchAnchor();
    watchDimensions();
  }, [watchAnchor, watchDimensions]);

  const unwatch = useCallback(() => {
    unwatchAnchor();
    unwatchDimensions();
  }, [unwatchAnchor, unwatchDimensions]);

  const togglers = {
    watch,
    unwatch,
  };

  return [{ top, left, ...dimensions }, coordinates, togglers];
}

export default useTether;
