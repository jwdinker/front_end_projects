import useDimensionsList from '@jwdinker/use-dimensions-list';
import * as React from 'react';
import useDebounceCallback from '@jwdinker/use-debounce-callback';
import { UseTether } from '../types';

import { makeTetheredOffsets } from './helpers';
import { ALIGNMENTS_TYPES } from '../constants';
import useAnchor from '../use_anchor';

const { useEffect, useCallback } = React;

const useTether: UseTether = (anchor, tetherables, alignment = ALIGNMENTS_TYPES.bottom) => {
  const [anchorOffsets, updatePosition] = useAnchor(anchor, tetherables);
  const [dimensions, resizeElements] = useDimensionsList(tetherables);

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
};

export default useTether;
