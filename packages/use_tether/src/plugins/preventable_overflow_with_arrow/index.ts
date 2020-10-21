import preventOverflow from '@jwdinker/prevent-overflow';
import { getTetherablePadding, getArrowPadding } from './helpers';
import { AbbreviatedRectangle, Side, Alignment } from '../../types';

function preventableOverflowWithArrow(
  offsets: AbbreviatedRectangle[],
  boundaries: AbbreviatedRectangle,
  alignment: Alignment = 'bottom',
  allow: Side[] = []
) {
  const [arrow, element] = offsets;

  return offsets.map((offset, index) => {
    const padding =
      index === 0
        ? getArrowPadding(alignment, arrow, element)
        : getTetherablePadding(alignment, arrow);
    return preventOverflow({ element: offset, boundaries, padding, allow })[0];
  });
}

export default preventableOverflowWithArrow;
