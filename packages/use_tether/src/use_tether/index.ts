import useDimensionsList, { ElementOrReference } from '@jwdinker/use-dimensions-list';
import * as React from 'react';
import useDebounceCallback from '@jwdinker/use-debounce-callback';
import { Alignment, UseTetherReturn } from '../types';

import { makeTetheredOffsets } from './helpers';
import { ALIGNMENTS_TYPES } from '../constants';
import useAnchor from '../use_anchor';

const { useEffect, useCallback } = React;

function useTether(
  anchorReference: ElementOrReference,
  tetheredReferences: ElementOrReference[],
  alignment: Alignment = ALIGNMENTS_TYPES.bottom
): UseTetherReturn {
  const [anchorOffsets, updatePosition] = useAnchor(anchorReference, tetheredReferences);
  const [dimensions, resizeElements] = useDimensionsList(tetheredReferences);

  const updateSizeAndPosition = useCallback(() => {
    updatePosition();
    resizeElements();
  }, [updatePosition, resizeElements]);

  const resizer = useDebounceCallback(updateSizeAndPosition, 100);

  useEffect(() => {
    window.addEventListener('resize', resizer);
    return () => {
      window.removeEventListener('resize', resizer);
    };
  }, [resizer]);

  return [
    makeTetheredOffsets(anchorOffsets, dimensions, alignment),
    anchorOffsets,
    updateSizeAndPosition,
  ];
}

export default useTether;
