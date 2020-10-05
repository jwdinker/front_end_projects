import * as React from 'react';
import useTether, { ALIGNMENTS_TYPES, ALIGNMENT_OPPOSITE_TYPES } from '@jwdinker/use-tether';

import { UsePopoverProps, UsePopoverReturn } from './types';
import { SHARED_STYLE, ARROW_ROTATIONS } from './constants';
import {
  reduceSides,
  computePopoverPadding,
  computeArrowPadding,
  getArrowRotationAdjustment,
} from './helpers';

const { useCallback } = React;

export { useAlignment } from '@jwdinker/use-tether';

function usePopover({
  anchor = null,
  popover = null,
  arrow = null,
  alignment = ALIGNMENTS_TYPES.bottom,
}: UsePopoverProps = {}): UsePopoverReturn {
  const [_popover, _anchor, popoverTogglers] = useTether(anchor, popover, alignment);
  const [_arrow, _, arrowTogglers] = useTether(
    _popover,
    arrow,
    ALIGNMENT_OPPOSITE_TYPES[alignment]
  );

  const isHorizontallyAligned = alignment === 'left' || alignment === 'right';
  const key = alignment === 'top' || alignment === 'bottom' ? 'top' : 'left';
  const operator = alignment === 'top' || alignment === 'left' ? -1 : 1;

  // the default padding here is used mainly for preventing overflow
  const padding = {
    popover: reduceSides((side) => computePopoverPadding(alignment, side, _popover, _arrow)),
    arrow: reduceSides((side) => computeArrowPadding(alignment, side, _popover, _arrow)),
  };

  const watch = useCallback(() => {
    popoverTogglers.watch();
    arrowTogglers.watch();
  }, [arrowTogglers, popoverTogglers]);

  const unwatch = useCallback(() => {
    popoverTogglers.unwatch();
    arrowTogglers.unwatch();
  }, [arrowTogglers, popoverTogglers]);

  const popoverAndArrowStyles = {
    popover: {
      ...SHARED_STYLE,
      ..._popover,
      [key]: _popover[key] + _arrow.height * operator,
    },
    arrow: {
      ...SHARED_STYLE,
      ..._arrow,
      rotate: ARROW_ROTATIONS[alignment],
      [key]: isHorizontallyAligned
        ? _arrow[key] + getArrowRotationAdjustment(_arrow) * operator
        : _arrow[key] + _arrow.height * operator,
    },
    padding,
    anchor: _anchor,
  };

  return [popoverAndArrowStyles, { watch, unwatch }];
}

export default usePopover;
