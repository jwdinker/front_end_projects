import { FlippableOptions } from '../../types';
import flippable from '../flippable';

function flippableWithArrow(options: FlippableOptions) {
  const { tetherables, preference = 'bottom' } = options;

  const isLeft = preference === 'left';
  const isRight = preference === 'right';
  const isX = isLeft || isRight;
  const hasTetheredElements = tetherables.length > 0;

  if (isX && hasTetheredElements) {
    const [originalArrow, ...elements] = tetherables;
    const arrow = { ...originalArrow };
    arrow.height = originalArrow.width;
    arrow.width = originalArrow.height;

    const updatedTethered = [arrow, ...elements];

    return flippable({
      ...options,
      tetherables: updatedTethered,
    });
  }
  return flippable(options);
}
export default flippableWithArrow;
