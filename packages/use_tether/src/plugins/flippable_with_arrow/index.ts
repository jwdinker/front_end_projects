import { DEFAULT_FLIP } from '../../constants';
import { FlipOptions, AbbreviatedRectangle } from '../../types';
import flippable from '../flippable';

function flippableWithArrow(
  anchorOffsets: AbbreviatedRectangle,
  tetheredOffsets: AbbreviatedRectangle[],
  boundaries: AbbreviatedRectangle,
  options: FlipOptions = {}
) {
  const { flip = DEFAULT_FLIP, preference = 'bottom' } = options;

  const isLeft = preference === 'left';
  const isRight = preference === 'right';
  const isX = isLeft || isRight;
  const hasTetheredElements = tetheredOffsets.length > 0;

  if (isX && hasTetheredElements) {
    const [originalArrow, ...elements] = tetheredOffsets;
    const arrow = { ...originalArrow };
    arrow.height = originalArrow.width;
    arrow.width = originalArrow.height;

    const updatedTethered = [arrow, ...elements];
    return flippable(anchorOffsets, updatedTethered, boundaries, { flip, preference });
  }
  return flippable(anchorOffsets, tetheredOffsets, boundaries, options);
}
export default flippableWithArrow;
