import { DEFAULT_FLIP } from '../../constants';
import { FlipOptions, AbbreviatedRectangle } from '../../types';
import flippable from '../flippable';

function flippableWithArrow(
  anchor: AbbreviatedRectangle,
  boundaries: AbbreviatedRectangle,
  options: FlipOptions = {}
) {
  const { flip = DEFAULT_FLIP, preference = 'bottom', tethered = [] } = options;

  const isLeft = preference === 'left';
  const isRight = preference === 'right';
  const isX = isLeft || isRight;
  const hasTetheredElements = tethered.length > 0;

  if (isX && hasTetheredElements) {
    const [originalArrow, ...elements] = tethered;
    const arrow = { ...originalArrow };
    arrow.height = originalArrow.width;
    arrow.width = originalArrow.height;

    const updatedTethered = [arrow, ...elements];
    return flippable(anchor, boundaries, { flip, preference, tethered: updatedTethered });
  }
  return flippable(anchor, boundaries, options);
}
export default flippableWithArrow;
