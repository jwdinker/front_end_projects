import { useMemo } from 'react';
import useTether, { ALIGNMENTS_TYPES, ALIGNMENT_OPPOSITE_TYPES } from '@jwdinker/use-tether';

import { UsePopoverProps, UsePopoverReturnValue } from './types';
import { SHARED_STYLE, ARROW_ROTATIONS } from './constants';
import {
  reduceSides,
  computePopoverPadding,
  computeArrowPadding,
  getArrowRotationAdjustment,
} from './helpers';

export { useAlignment } from '@jwdinker/use-tether';

function usePopover({
  anchor = null,
  popover = null,
  arrow = null,
  alignment = ALIGNMENTS_TYPES.bottom,
}: UsePopoverProps = {}): UsePopoverReturnValue {
  const [_popover, _anchor] = useTether(anchor, popover, alignment);
  const [_arrow] = useTether(_popover, arrow, ALIGNMENT_OPPOSITE_TYPES[alignment]);

  const isHorizontallyAligned = alignment === 'left' || alignment === 'right';
  const key = alignment === 'top' || alignment === 'bottom' ? 'top' : 'left';
  const operator = alignment === 'top' || alignment === 'left' ? -1 : 1;

  // the default padding here is used mainly for preventing overflow
  const padding = useMemo(
    () => ({
      popover: reduceSides((side) => computePopoverPadding(alignment, side, _popover, _arrow)),
      arrow: reduceSides((side) => computeArrowPadding(alignment, side, _popover, _arrow)),
    }),
    [_arrow, _popover, alignment]
  );

  const value = useMemo(
    (): UsePopoverReturnValue => ({
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
    }),
    [_anchor, _arrow, _popover, alignment, isHorizontallyAligned, key, operator, padding]
  );

  return value;
}

export default usePopover;
