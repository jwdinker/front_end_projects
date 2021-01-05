import { ALIGNMENTS_TYPES } from '../constants';
import { Alignment, Measurements } from '../types';

function inferAlignment(anchor: Measurements, element: Measurements): Alignment {
  const centerX = element.left + element.width / 2;
  const centerY = element.top + element.height / 2;

  if (centerY < anchor.top) {
    return ALIGNMENTS_TYPES.top;
  }

  if (centerX < anchor.left) {
    return ALIGNMENTS_TYPES.left;
  }

  if (centerX > anchor.left + anchor.width) {
    return ALIGNMENTS_TYPES.right;
  }

  return ALIGNMENTS_TYPES.bottom;
}

export default inferAlignment;
